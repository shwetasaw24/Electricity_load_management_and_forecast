import { LineChart as LC, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function LineChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LC data={data}>
        <XAxis dataKey="t" hide />
        <YAxis />
        <Tooltip />
        <Line dataKey="load" stroke="#8884d8" />
      </LC>
    </ResponsiveContainer>
  );
}
