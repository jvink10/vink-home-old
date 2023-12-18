type Props = {
  timeData: {timeZone: string, time: string, date: string, dayOfWeek: string};
  removeTimeZone: Function;
};

export default function Clock(props: Props) {
  const city = props.timeData.timeZone.split("/")[1];

  const removeTimeZone = () => {
    props.removeTimeZone(props.timeData.timeZone);
  };

  return (
    <div className="relative group px-8 py-16 w-56 text-center">
      <h2 className="text-lg">{city}</h2>
      <p className="text-2xl font-bold">{props.timeData.time}</p>
      <button onClick={removeTimeZone} className="hidden group-hover:block absolute w-40">Remove</button>
    </div>
  );
};
