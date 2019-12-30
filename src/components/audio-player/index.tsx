import React, { MouseEvent, RefObject, KeyboardEvent } from "react";
import "./index.css";

interface IProps {
  path: string;
  image: string;
}

interface IState {
  isPlay: boolean;
  percentage: string;
  currentDuration: number;
  seekBar: number;
}

const AudioPlayer: React.FC<IProps> = function({ path, image }) {
  const [state, setState] = React.useState<IState>({
    isPlay: false,
    percentage: "0",
    currentDuration: 0,
    seekBar: 0
  });

  const audioFile: RefObject<HTMLAudioElement> = React.createRef<
    HTMLAudioElement
  >();
  const audioSeekBar: RefObject<HTMLDivElement> = React.createRef<
    HTMLDivElement
  >();

  const controlAudio = (e: MouseEvent) => {
    const audio = audioFile.current;
    if (audio) {
      if (audio.duration > 0 && !audio.paused) {
        // pause audio and stop counting
        audio.pause();
        setState({
          ...state,
          isPlay: false
        });
      } else {
        // play audio
        audio.play();
        setState({
          ...state,
          isPlay: true
        });
      }
    }
  };

  const getCurrentDuration = () => {
    const audio = audioFile.current;

    if (audio) {
      const percentage = ((audio.currentTime / audio.duration) * 100).toFixed(
        2
      );

      setState({
        ...state,
        currentDuration: audio.currentTime,
        percentage
      });
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

          setState({
            ...state,
            percentage: tempPercentage.toString()
          });

          audio.currentTime = audio.duration * (tempPercentage / 100);
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

    setState({ ...state, percentage: (pos * 100).toString() });

    audio.currentTime = audio.duration * pos;
  };

  const { isPlay, percentage } = state;

  return (
    <>
      <div className="u-bg" style={{ backgroundImage: `url("${image}")` }}>
        <div className="c-audio" aria-label="Audio Player" role="region">
          <button
            title={!isPlay || isPlay === null ? "Play" : "Pause"}
            className={
              !isPlay || isPlay === null
                ? "c-audio u-btn l-play l-play__play"
                : "c-audio u-btn l-play l-play__pause"
            }
            aria-controls="audio1"
            onClick={controlAudio}
            aria-label={!isPlay || isPlay === null ? "Play" : "Pause"}
          />
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
        </div>
      </div>
      <audio
        className="c-audio__sound"
        id="audio1"
        src={path}
        onTimeUpdate={getCurrentDuration}
        onEnded={() => {
          if (audioFile?.current) {
            audioFile.current.currentTime = 0;
            setState({
              ...state,
              currentDuration: 0,
              percentage: '0',
              isPlay: false
            });
          }
        }}
        ref={audioFile}
      >
        <track kind="captions" />
      </audio>
    </>
  );
};

export default AudioPlayer;
