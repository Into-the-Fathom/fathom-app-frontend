import { FC } from "react";
import { ITimeObject } from "fathom-contracts-helper";

const StakingCountdown: FC<{ timeObject: ITimeObject }> = ({ timeObject }) => {
  return (
    <>
      {timeObject.days} days {timeObject.hour} hrs {timeObject.min} min{" "}
      {timeObject.sec} sec left
    </>
  );
};

export default StakingCountdown;
