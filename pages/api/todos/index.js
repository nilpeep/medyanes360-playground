import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      const newTodo = req.body;
      const createdTodo = await prisma.todo.create({ data: newTodo });
      res.json(createdTodo);
      break;
    case "GET":
      const todos = await prisma.todo.findMany();
      res.json(todos);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
