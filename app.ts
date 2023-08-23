import express from "express";
import prisma from "./prisma"; // importing the prisma instance we created.

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

app.post("/users", async (req, res) => {
  try {
    const { name, games } = req.body;

    // games is an array of string | string[]

    const newUser = await prisma.user.create({
      data: {
        name, // name is provided by the request body
        games: {
          // create or connect means if the game existed, we will use the old one
          // if not, we will create a new game
          connectOrCreate: games.map((game: string) => ({
            where: {
              name: game,
            },
            create: {
              name: game,
            },
          })),
        },
      },
    });

    res.json(newUser);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});
