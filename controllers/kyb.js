import { User } from "../models/userSchema.js";
import PDFDocument from 'pdfkit';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const Kyb = async (req, res) => {
    try {
        // console.log("Inside KYB function");

        // Parse membershipNumber
        const membershipNumber = req.query.membershipNumber?.trim(); // Ensure it's a string
        // console.log("Membership number received:", membershipNumber);

        if (!membershipNumber) {
            return res.status(400).json({ message: "Membership number is required" });
        }

        // Query the database
        // console.log("Querying database with:", { MRN: membershipNumber });
        const user = await User.findOne({ MRN: membershipNumber });
        if (!user) {
            // console.error("User not found for MRN:", membershipNumber);
            return res.status(404).json({ message: "User not found" });
        }

        // console.log("User data retrieved:", user);

        // Set response headers for PDF download
        const fileName = `Polling_Booth_${user.name.replace(/ /g, "_")}_${membershipNumber}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // Create the PDF document
        const doc = new PDFDocument();

        // Pipe the PDF data to the response
        doc.pipe(res);
        console.log("response", res)
        // Add content to the PDF
        const backgroundImage = path.join(__dirname, '..', 'public', 'img', 'kyb.jpeg');
        doc.image(backgroundImage, 0, 0, { width: 595, height: 210 });

        doc.fontSize(18).text('Know Your Polling Booth Details', { align: 'center', underline: true });

        doc.moveDown();
        doc.fontSize(12).text(`Voter Serial Number: ${user.voterSerialNo}`);
        doc.text(`Membership No.: ${user.MRN}`);
        doc.text(`Name: ${user.name}`);
        doc.text(`Location: ${user.location}`);
        doc.text(`Booth No.: ${user.boothNo}`);
        doc.text(`Booth Address: ${user.address}`);
        doc.text(`Date: ${user.date}`);

        const footerImage = path.join(__dirname, '..', 'public', 'img', 'kyb3.jpeg');
        doc.image(footerImage, 0, 650, { width: 595, height: 150 });

        // Finalize and end the PDF
        doc.end();
        console.log("PDF generation completed");
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
