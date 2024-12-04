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
        // Parse the membership number
        const membershipNumber = req.query.membershipNumber?.trim();
        if (!membershipNumber) {
            return res.status(400).json({ message: "Membership number is required" });
        }

        // Query the database
        const user = await User.findOne({ MRN: membershipNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Set filename for the PDF
        const fileName = `Polling_Booth_${user.name.replace(/ /g, "_")}_${membershipNumber}.pdf`;

        // Set response headers for file download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // Create a new PDF document
        const doc = new PDFDocument();

        // Pipe the PDF to the response
        doc.pipe(res);

        // Add the background image (move it down by adjusting the Y position)
        const backgroundImage = path.join(__dirname, '..', 'public', 'img', 'kyb.jpeg');
        const yPositionForBackground = 60; // Change this value to move the image down
        doc.image(backgroundImage, 0, yPositionForBackground, { width: 595, height: 270 });

        // Title
        doc.fontSize(18).text('Know Your Polling Booth Details', { align: 'center', underline: true });

        // Move down for the table
        doc.moveDown();

        // Set font for table headers and values
        doc.fontSize(12).font('Helvetica');
        const col1Width = 180; // width of first column (labels)
        const col2Width = 400; // width of second column (values)
        const rowHeight = 20;  // height of each row
        const startX = 50;     // X position for first column
        let startY = doc.y;    // Y position for table (start where content left off)

        // 1st Row: Voter Serial Number
        doc.text('Voter Serial Number:', startX, startY, { width: col1Width, align: 'left' });
        doc.text(user.voterSerialNo, startX + col1Width, startY, { width: col2Width, align: 'left' });

        // Draw a horizontal line below the row
        doc.lineWidth(0.5).moveTo(startX, startY + rowHeight)
            .lineTo(startX + col1Width + col2Width, startY + rowHeight).stroke();

        // Move to the next row
        startY += rowHeight + 1;

        // 2nd Row: Membership No.
        doc.text('Membership No.:', startX, startY, { width: col1Width, align: 'left' });
        doc.text(user.MRN, startX + col1Width, startY, { width: col2Width, align: 'left' });

        // Draw a horizontal line below the row
        doc.lineWidth(0.5).moveTo(startX, startY + rowHeight)
            .lineTo(startX + col1Width + col2Width, startY + rowHeight).stroke();

        // Move to the next row
        startY += rowHeight;

        // 3rd Row: Name
        doc.text('Name:', startX, startY, { width: col1Width, align: 'left' });
        doc.text(user.name, startX + col1Width, startY, { width: col2Width, align: 'left' });

        // Draw a horizontal line below the row
        doc.lineWidth(0.5).moveTo(startX, startY + rowHeight)
            .lineTo(startX + col1Width + col2Width, startY + rowHeight).stroke();

        // Move to the next row
        startY += rowHeight;

        // 4th Row: Location
        doc.text('Location:', startX, startY, { width: col1Width, align: 'left' });
        doc.fillColor('blue').text(user.location, startX + col1Width, startY, { width: col2Width, align: 'left', link: user.location });
        doc.fillColor('black'); // Reset to black for further text

        // Draw a horizontal line below the row
        doc.lineWidth(0.5).moveTo(startX, startY + rowHeight)
            .lineTo(startX + col1Width + col2Width, startY + rowHeight).stroke();

        // Move to the next row
        startY += rowHeight;

        // 5th Row: Booth No.
        doc.text('Booth No.:', startX, startY, { width: col1Width, align: 'left' });
        doc.text(user.boothNo, startX + col1Width, startY, { width: col2Width, align: 'left' });

        // Draw a horizontal line below the row
        doc.lineWidth(0.5).moveTo(startX, startY + rowHeight)
            .lineTo(startX + col1Width + col2Width, startY + rowHeight).stroke();

        // Move to the next row
        startY += rowHeight;

        // 6th Row: Booth Address
        doc.text('Booth Address:', startX, startY, { width: col1Width, align: 'left' });
        doc.text(user.address, startX + col1Width, startY, { width: col2Width, align: 'left' });

        // Draw a horizontal line below the row
        doc.lineWidth(0.5).moveTo(startX, startY + rowHeight)
            .lineTo(startX + col1Width + col2Width, startY + rowHeight).stroke();

        // Move to the next row
        startY += rowHeight;

        // 7th Row: Date
        doc.text('Date:', startX, startY, { width: col1Width, align: 'left' });
        doc.text(user.date, startX + col1Width, startY, { width: col2Width, align: 'left' });

        // Draw a horizontal line below the row
        doc.lineWidth(0.5).moveTo(startX, startY + rowHeight)
            .lineTo(startX + col1Width + col2Width, startY + rowHeight).stroke();

        // Add footer image (bottom of the page)
        const footerImage = path.join(__dirname, '..', 'public', 'img', 'kyb3.jpeg');
        doc.image(footerImage, 0, 350, { width: 610, height: 350 });

        // Finalize the PDF
        doc.end();

        console.log('PDF generated successfully');
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
