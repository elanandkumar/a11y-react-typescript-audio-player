import React, { MouseEvent, RefObject, KeyboardEvent, useEffect } from "react";
import "./index.css";

interface IProps {
  percentage: string;
  onUpdate: any
};

const Slider:React.FC<IProps> = function({ percentage, onUpdate }) {

  const audioSeekBar: RefObject<HTMLDivElement> = React.createRef<
    HTMLDivElement
  >();

  const audioFile = {
    current: {
      duration: 2,
      currentTime: 0
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLOrSVGElement>) => {
    // when user focus in audio slider and
    // clicks keys inside key list, will change current time of audio
    const audio = audioFile.current;

    if (audio) {
      const isLeft = 37;
      const isRight = 39;
      const isTop = 38;
      const isBottom = 40;
      const isHome = 36;
      const isEnd = 35;
      const keyList = [isLeft, isRight, isTop, isBottom, isHome, isEnd];

      if (keyList.indexOf(e.keyCode) >= 0) {
        // @ts-ignore
        const { percentage } = state;

        if (percentage) {
          let tempPercentage: number;
          switch (e.keyCode) {
            case isLeft:
              tempPercentage = parseFloat(percentage) - 1;
              break;
            case isRight:
              tempPercentage = parseFloat(percentage) + 1;
              break;
            case isTop:
              tempPercentage = parseFloat(percentage) + 10;
              break;
            case isBottom:
              tempPercentage = parseFloat(percentage) - 10;
              break;
            case isHome:
              tempPercentage = 0;
              break;
            case isEnd:
              tempPercentage = 99.9; // 100 would trigger onEnd, so only 99.9
              break;
            default:
              tempPercentage = 0;
              break;
          }

          // add boundary for percentage, cannot be bigger than 100 or smaller than zero
          if (tempPercentage > 100) {
            tempPercentage = 100;
          } else if (tempPercentage < 0) {
            tempPercentage = 0;
          }

          audio.currentTime = audio.duration * (tempPercentage / 100);

          onUpdate(tempPercentage.toString());
        }
      }
    }
  };

  const onClick = (e: MouseEvent) => {
    const seekBar: any = audioSeekBar.current;
    const audio: any = audioFile.current;

    const pos =
      (e.pageX -
        (seekBar.getBoundingClientRect().x ||
          seekBar.getBoundingClientRect().left)) /
      seekBar.getClientRects()[0].width;

    const tempPercentage = (pos * 100).toString();

    audio.currentTime = audio.duration * pos;

    onUpdate(tempPercentage);
  };

  return (
    <div
      className="c-audio__slider"
      onKeyDown={onKeyDown}
      onClick={onClick}
      tabIndex={0}
      aria-valuetext="seek audio bar"
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(+percentage)}
      role="slider"
      ref={audioSeekBar}
    >
      <div className="c-audio__length">
        <svg
          className="c-audio__bar"
          viewBox="0 0 100% 6"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="0" width={percentage + "%"} height="6" rx="3" />
        </svg>
      </div>
    </div>
  );
};

export default Slider;
