type Props = {
  timeData: {timeZone: string, time: string, date: string, dayOfWeek: string};
};

export default function Clock(props: Props) {
  const [continent, city] = props.timeData.timeZone.split("/");

  return (
    <div className="p-16 w-48 text-center">
      <h2 className="text-lg">{city}</h2>
      <p className="text-2xl font-bold">{props.timeData.time}</p>
    </div>
  );
};
