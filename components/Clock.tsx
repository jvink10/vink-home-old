import { useState, useEffect } from 'react';

type Props = {
  timeData: {timeZone: string, time: string, date: string, dayOfWeek: string};
};

export default function Clock(props: Props) {
  const [time, setTime] = useState<string>(props.timeData.time);

  useEffect(() => {
    const minuteInterval = setInterval(() => {
			setTime((prevTime) => {
				const [hour, minute]: Array<string | number> = prevTime.split(":");
				const updatedMinute = (parseInt(minute) + 1) % 60;
				const updatedHour = updatedMinute === 0 ? (parseInt(hour) + 1) % 24 : parseInt(hour);
				//If updatedHour === 0 update dayOfWeek and date

				return(`${updatedHour.toString().padStart(2, '0')}:${updatedMinute.toString().padStart(2, '0')}`);
			});
    }, 60000);

		return () => clearInterval(minuteInterval);
  }, []);

  const [continent, city] = props.timeData.timeZone.split("/");

  return (
    <div className="p-16 w-48 text-center">
      <h2 className="text-lg">{city}</h2>
      <p className="text-2xl font-bold">{time}</p>
    </div>
  );
};
