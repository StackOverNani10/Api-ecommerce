import app from "./app.js";

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
  console.log("Aplication name", app.get("name"));
})