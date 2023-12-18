type Props = {
  timeData: {timeZone: string, time: string, date: string, dayOfWeek: string};
  removeTimeZone: Function;
};

export default function Clock(props: Props) {
  let label = props.timeData.timeZone;

  if (label.includes("/")) {
    const labelList = label.split("/");
    label = labelList[labelList.length - 1];
  };

  label = label.replaceAll("_", " ");

  const removeTimeZone = () => {
    props.removeTimeZone(props.timeData.timeZone);
  };

  return (
    <div className="relative group px-8 py-16 w-56 text-center">
      <h2 className="text-lg">{label}</h2>
      <p className="text-2xl font-bold">{props.timeData.time}</p>
      <button onClick={removeTimeZone} className="hidden group-hover:block absolute w-40">Remove</button>
    </div>
  );
};
