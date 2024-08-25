import Svg, { Path, G, Line } from "react-native-svg";

export function LucideHouse(props: any) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="35"
      viewBox="0 0 24 24"
      {...props}
    >
      <G
        fill="none"
        stroke="#131842"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <Path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></Path>
        <Path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></Path>
      </G>
    </Svg>
  );
}
