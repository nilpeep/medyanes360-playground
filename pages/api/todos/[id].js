import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case "DELETE":
      await prisma.todo.delete({ where: { id: id } });
      res.status(200).json({ message: "Todo deleted" });
      break;
    case "PUT":
      const updatedTodo = req.body;
      const todo = await prisma.todo.update({
        where: { id: id },
        data: updatedTodo,
      });
      res.json(todo);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
