import { User } from "../models/userSchema.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import PDFDocument from 'pdfkit';
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const Kyb = async (req, res) => {
    try {
        const membershipNumber = req.query.membershipNumber;

        console.log("Getting call in kyb");
        if (!membershipNumber) {
            return res.status(400).json({ message: "Membership number is required" });
        }

        const user = await User.find();
        const userData = user[0];

        if (!userData) {
            return res.status(404).json({ message: "Membership number not found" });
        }

        // Set response headers for file download
        const fileName = `Polling_Booth_${userData.name.replace(/ /g, "_")}_${membershipNumber}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // Create PDF document and pipe it directly to the response
        const doc = new PDFDocument();
        doc.pipe(res);

        // Background image
        const backgroundImage = path.join(__dirname, '..', 'public', 'img', 'kyb.jpeg');
        doc.image(backgroundImage, { width: 595, height: 210 });

        // Title
        doc.fontSize(18).text('Know Your Polling Booth Details', { align: 'center' });

        // Add details
        doc.fontSize(12).text(`Voter Serial Number: ${userData.voterSerialNo}`);
        doc.text(`Membership No.: ${userData.mrn}`);
        doc.text(`Name: ${userData.name}`);
        doc.text(`Location: ${userData.location}`);
        doc.text(`Booth No.: ${userData.boothNo}`);
        doc.text(`Booth Address: ${userData.address}`);
        doc.text(`Date: ${userData.date}`);

        // Footer image
        const footerImage = path.join(__dirname, '..', 'public', 'img', 'kyb3.jpeg');
        doc.image(footerImage, { width: 595, height: 150, align: 'center' });

        // Finalize the PDF
        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

