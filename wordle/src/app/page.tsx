import Word from "./Word";
import Leaderboard from "./Leaderboard";
import Bendle from "./Bendle";
export default function Home() {
  return (
    <>
      <div className="gameboard">
        <Bendle></Bendle>
        <Word></Word>
        <Leaderboard></Leaderboard>
      </div>
    </>
  );
}
