import { BarChart as BC, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function BarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BC data={data}>
        <XAxis dataKey="t" hide />
        <YAxis />
        <Tooltip />
        <Bar dataKey="load" fill="#82ca9d" />
      </BC>
    </ResponsiveContainer>
  );
}
