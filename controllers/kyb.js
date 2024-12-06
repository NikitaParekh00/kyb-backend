import { User } from "../models/userSchema.js";

export const Kyb = async (req, res) => {
  try {
    const membershipNumber = req.query.membershipNumber
      ?.replace(/\s+/g, "")
      .trim();
    if (!membershipNumber) {
      return res.status(400).json({
        success: false,
        message: "Membership number is required",
      });
    }

    // Query the database to find user by MRN
    let user = await User.findOne({ MRN: membershipNumber });

    // If not found by MRN, attempt to find by phone number
    if (!user) {
      user = await User.findOne({ mobile: membershipNumber });
    }

    // If still not found, send a 404 response
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prepare the data to be sent to the frontend
    const userData = {
      MRN: user.MRN || null,
      name: user.name || null,
      voterSerialNo: user.voterSerialNo || null,
      boothNo: user.boothNo || null,
      address: user.address || null,
      location: user.location || null,
      date: user.date || null,
    };

    // Send the user data as JSON
    return res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
