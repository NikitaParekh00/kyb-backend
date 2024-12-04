import { User } from "../models/userSchema.js";
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get file path for current module (for image paths)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const Kyb = async (req, res) => {
    try {
        const membershipNumber = req.query.membershipNumber?.trim();
        if (!membershipNumber) {
            return res.status(400).json({ message: "Membership number is required" });
        }

        // Query the database
        const user = await User.findOne({ MRN: membershipNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const fileName = `Polling_Booth_${user.name.replace(/ /g, "_")}_${membershipNumber}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        const doc = new PDFDocument();
        doc.pipe(res);

        // Background image
        const backgroundImage = path.join(__dirname, '..', 'public', 'img', 'kyb.jpeg');
        doc.image(backgroundImage, 0, 60, { width: 595, height: 270 });

        // Title
        doc.fontSize(18).text('Know Your Polling Booth Details', { align: 'center', underline: true });
        doc.moveDown();

        // Table headers and data
        const tableHeaders = [];
        const tableData = [
            { label: 'Voter Serial Number', value: user.voterSerialNo },
            { label: 'Membership No.', value: user.MRN },
            { label: 'Name', value: user.name },
            { label: 'Location', value: user.location },
            { label: 'Booth No.', value: user.boothNo },
            { label: 'Booth Address', value: user.address },
            { label: 'Date', value: user.date }
        ];

        // Render table headers
        doc.fontSize(12).text(tableHeaders[0], 50, doc.y, { width: 250, align: 'left' });
        doc.text(tableHeaders[1], 300, doc.y, { width: 250, align: 'left' });

        let lastYPosition = doc.y; // Track Y position after header
        const rowPadding = 15; // Define a custom padding value between rows

        // Render table rows with custom padding
        tableData.forEach(item => {
            // Manually position the text for each row
            const labelHeight = doc.heightOfString(item.label, { width: 100, align: 'left' });
            const valueHeight = doc.heightOfString(item.value, { width: 300, align: 'left' });

            // Adjust the row height based on content length (if necessary)
            const rowHeight = Math.max(labelHeight, valueHeight);

            // Render label and value in each row
            doc.text(item.label, 50, lastYPosition, { width: 100, align: 'left' });
            doc.text(item.value, 300, lastYPosition, { width: 300, align: 'left' });

            // Update the lastYPosition based on the row height and padding
            lastYPosition += rowHeight + rowPadding;  // Add padding after each row
        });

        // Calculate the position for the footer image
        const footerImage = path.join(__dirname, '..', 'public', 'img', 'kyb3.jpeg');
        const footerHeight = 350; // Height of the footer image
        const pageHeight = doc.page.height; // Page height (for standard A4 size)
        
        // Place the footer image at the bottom of the page or just after the table
        const imageYPosition = (lastYPosition + footerHeight > pageHeight - 20) 
            ? lastYPosition + 20 // Add a small margin if the content is too close to the bottom
            : pageHeight - footerHeight - 20; // Otherwise, place it just above the bottom margin

        doc.image(footerImage, 0, imageYPosition, { width: 610, height: footerHeight });

        doc.end();
        console.log('PDF generated successfully');
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
