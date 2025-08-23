import { useState, useEffect } from "react";
import axios from "axios";

function Areas() {
  const [areas, setAreas] = useState([]);
  const [form, setForm] = useState({ ID_AREA: "", NOMBRE: ""});

  useEffect(() => {
    axios.get("http://localhost:4000/api/area").then((res) => setAreas(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/api/area", form);
    setForm({ ID_AREA: "", NOMBRE: ""});
    const res = await axios.get("http://localhost:4000/api/area");
    setAreas(res.data);
  };

  return (
    <div>
      <h1>Areas</h1>
      <form onSubmit={handleSubmit}>
        <input placeholder="ID Area" value={form.ID_AREA} 
               onChange={(e) => setForm({ ...form, ID_AREA: e.target.value })} />
        <input placeholder="Nombre" value={form.NOMBRE} 
               onChange={(e) => setForm({ ...form, NOMBRE: e.target.value })} />
        <button type="submit">Agregar</button>
      </form>

      <ul>
        {areas.map((c) => (
          <li key={c.ID_AREA}>{c.NOMBRE} </li>
        ))}
      </ul>
    </div>
  );
}

export default Areas;
