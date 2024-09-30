export default function Time() {
  const date = new Date();
  const showTime =
    date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  return <div>{showTime}</div>;
}
