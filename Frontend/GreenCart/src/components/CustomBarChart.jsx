import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const COLORS = ["#47ac7d", "#72cca2"];

export const CustomBarChart = ({ data, heading }) => {
  const channelData = data.map(({ paymentType, totalSales }) => ({
    name: paymentType,
    value: totalSales,
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-medium mb-4">{heading}</h2>
      <div className="w-full h-80">
        <ResponsiveContainer>
          <BarChart data={channelData} barCategoryGap={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              stroke="#6B7280"
              tick={{ fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#6B7280"
              tick={{ fontSize: 13 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                borderColor: "#4B5563",
                borderRadius: "0.5rem",
              }}
              labelStyle={{
                color: "#E5E7EB",
                fontWeight: 300,
              }}
              itemStyle={{ color: "#E5E7EB", fontSize: "0.875rem" }}
              formatter={(value) => [`₹ ${value.toLocaleString()}`, "Value"]}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: "0.875rem", marginTop: "1rem" }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Payment Types">
              {channelData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
