const tasks = [
  { title: "Shopping", description: "Go grocery shopping." },
  { title: "Pick up kid", description: "Pick up the kid from school." },
  {
    title: "Walk the dog",
    description: "Take the dog for a walk in the park.",
  },
  { title: "Clean the house", description: "Do a deep clean of the house." },
  { title: "Finish homework", description: "Complete the math homework." },
  { title: "Prepare dinner", description: "Make spaghetti for dinner." },
  {
    title: "Doctor's appointment",
    description: "Visit the doctor for a check-up.",
  },
  { title: "Gym workout", description: "Go to the gym for a workout." },
  { title: "Pay bills", description: "Pay the electricity and water bills." },
  { title: "Attend meeting", description: "Join the work meeting at 3 PM." },
  { title: "Grocery list", description: "Create a list for groceries needed." },
  { title: "Laundry", description: "Do the laundry and fold the clothes." },
  {
    title: "Book travel",
    description: "Book a flight for the family vacation.",
  },
  { title: "Plant flowers", description: "Plant new flowers in the garden." },
  { title: "Guitar practice", description: "Practice guitar for 30 minutes." },
  { title: "Read a book", description: "Read a chapter of a new book." },
  {
    title: "Visit grandparents",
    description: "Spend some time with grandparents.",
  },
  {
    title: "Update resume",
    description: "Update the resume for job applications.",
  },
  {
    title: "Plan weekend",
    description: "Plan activities for the upcoming weekend.",
  },
  {
    title: "Organize closet",
    description: "Organize the clothes in the closet.",
  },
  { title: "Watch a movie", description: "Watch a family-friendly movie." },
];

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const args = process.argv.slice(2);

if (args.length < 1) {
  return console.error(
    `Expected access token. 
    Usage: npm run populateDb <your_access_token>`
  );
}

const jwt = require("jsonwebtoken");
const queries = require("./database/queries");
const { pollDatabaseAndSendMail } = require("./controller/taskController");

jwt.verify(args[0], process.env.JWT_SECRET, async (err, payload) => {
  if (err) {
    console.error("token invalid");
    process.exit(0);
  } else {
    const { user_id } = payload;
    for (let i = 0; i < tasks.length; i++) {
      const randomMinutes = Math.floor(Math.random() * 3000) + 30;

      const dueDate = new Date(Date.now() + randomMinutes * 60 * 100);

      await queries.addTask(
        user_id,
        tasks[i].title,
        tasks[i].description,
        dueDate
      );

      console.log(i + 1, " Task Added.");
    }
    await pollDatabaseAndSendMail();
    process.exit(1);
  }
});

process.exit(0);
