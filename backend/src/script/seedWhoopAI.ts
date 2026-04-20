import "dotenv/config";
import UserModel from "../models/user.model";
import connectDatabase from "../config/database.config";

export const CreateWhoopAI = async () => {
  let whoopAI = await UserModel.findOne({ isAI: true });
  if (whoopAI) {
    console.log("✅ Whoop AI already exists");
    return whoopAI;
  }
  whoopAI = await UserModel.create({
    name: "Whoop AI",
    isAI: true,
    avatar:
      "https://res.cloudinary.com/dp9vvlndo/image/upload/v1759925671/ai_logo_qqman8.png", // Your AI a
  });
  console.log("✅ Whoop AI created:", whoopAI._id);
  return whoopAI;
};

const seedWhoopAI = async () => {
  try {
    await connectDatabase();
    await CreateWhoopAI();
    console.log("Seeding completed");
    process.exit(0);
  }
    catch (error) { 
    console.error("Error seeding Whoop AI:", error);
    process.exit(1);
  } 
}

seedWhoopAI();
