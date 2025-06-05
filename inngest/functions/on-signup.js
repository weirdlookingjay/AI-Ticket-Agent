import { inngest } from "../client.js";
import User from "../../models/user.js";
import sendMail from "../../utils/mailer.js";
import { NonRetriableError } from "inngest";

export const onUserSignup = inngest.createFunction(
  { id: "on-user-signup", retries: 2 },
  { event: "user/signup" },
  // First pipeline step: get user by email
  async ({ event, step }) => {
    try {
      const { email } = event.data;
      const user = await step.run("get-user-email", async () => {
        // Simulate a database call to find the user by email
        const userObject = await User.findOne({ email });
        if (!userObject) {
          throw new NonRetriableError(`User with email ${email} not found`);
        }
        return userObject;
      });

      // Second pipeline step: send welcome email
      await step.run("send-welcome-email", async () => {
        // Simulate sending a welcome email
        const subject = `Welcome to Our Service!`;
        const message = `Hello, ${email}! Thank you for signing up.`;
        await sendMail(user.email, subject, message);
        console.log(`Sending welcome email to ${email}`);
      });

      return { success: true };
    } catch (error) {
      console.error("❌ Error in onUserSignup function:", error.message);
      return { success: false };
    }
  }
);
