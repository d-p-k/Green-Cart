import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#378661",
  "#3f996f",
  "#47ac7d",
  "#4fbf8b",
  "#61c597",
  "#72cca2",
  "#84d2ae",
];

export const CustomPieChart = ({ data, heading }) => {
  const channelData = data.map(({ category, totalSales }) => ({
    name: category,
    value: totalSales,
  }));

  return (
    <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
      <h2 className="text-lg font-medium mb-4">{heading}</h2>
      <div className="w-full h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={channelData}
              cx="50%"
              cy="50%"
              outerRadius="70%"
              innerRadius="30%"
              dataKey="value"
              label={({ name, percent }) =>
                window.innerWidth < 640
                  ? `${(percent * 100).toFixed(0)}%`
                  : `${name}: ${(percent * 100).toFixed(0)}%`
              }
              fontSize={13}
              labelLine={false}
            >
              {channelData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.9)",
                borderColor: "#4B5563",
                borderRadius: "0.5rem",
              }}
              itemStyle={{ color: "#E5E7EB", fontSize: "0.875rem" }}
              formatter={(value) => [`₹ ${value.toLocaleString()}`, "Value"]}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: "0.875rem", marginTop: "1rem" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
