import { css, keyframes } from "@emotion/react";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function ThemeToggle(props: { onClick: () => void; isDark: boolean }) {
  const right = 12;
  const top = 12;
  const ICONTOPHIGH = `${top}px`;
  const ICONTOPLOW = `${top + 13}px`;
  const ICONRIGHT = `${right}px`;
  const ICONRIGHTFROM = `${right + 10}px`;
  const ICONRIGHTTO = `${right - 10}px`;

  const raise = keyframes`
    from {
      opacity: 0;
      top: ${ICONTOPLOW};
      right: ${ICONRIGHTFROM};
      transform: rotate(-45deg);
    }
    to {
      opacity: 1;
      top: ${ICONTOPHIGH};
      right: ${ICONRIGHT};
    }`;
  const down = keyframes`
    from {
      opacity: 1;
      top: ${ICONTOPHIGH};
      right: ${ICONRIGHT};
    }
    to {
      opacity: 0;
      top: ${ICONTOPLOW};
      right: ${ICONRIGHTTO};
      transform: rotate(45deg);
    }`;

  return (
    <div
      onClick={props.onClick}
      css={css`
        position: relative;
        height: 48px;
        width: 48px;
        z-index: 10;
      `}
    >
      <DarkModeIcon
        css={css`
          position: absolute;
          opacity: ${props.isDark ? 1 : 0};
          top: ${props.isDark ? ICONTOPHIGH : ICONTOPLOW};
          right: ${props.isDark ? ICONRIGHT : ICONRIGHTTO};
          animation: ${props.isDark ? raise : down} 1s;
        `}
      />
      <WbSunnyIcon
        css={css`
          position: absolute;
          opacity: ${props.isDark ? 0 : 1};
          top: ${props.isDark ? ICONTOPLOW : ICONTOPHIGH};
          right: ${props.isDark ? ICONRIGHTTO : ICONRIGHT};
          animation: ${props.isDark ? down : raise} 1s;
        `}
      />
    </div>
  );
}
