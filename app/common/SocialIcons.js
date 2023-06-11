import { ClipboardCopy, Mail, Twitter } from "lucide-react";
import { TelegramLogo, ChatCenteredText } from "phosphor-react";

const SocialIcons = {
  Email: () => <Mail size={16} />,
  Twitter: () => <Twitter size={16} />,
  Copy: () => <ClipboardCopy size={16} />,
  SMS: () => <ChatCenteredText size={16} />,
  Telegram: () => <TelegramLogo size={16} />,
  Messenger: () => (
    <svg
      height="16"
      width="16"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.79313 12.6572L2.76143 13.2386L3.34279 11.2069L3.34284 11.2067C3.362 11.1378 3.36723 11.0658 3.35822 10.9949C3.34922 10.924 3.32616 10.8556 3.2904 10.7937L3.29026 10.7935C2.67392 9.75459 2.41846 8.54103 2.56368 7.34182C2.7089 6.14261 3.24663 5.02509 4.09313 4.16333C4.93963 3.30157 6.04736 2.74396 7.24378 2.57733C8.4402 2.41071 9.65814 2.64444 10.7079 3.24212C11.7576 3.8398 12.5802 4.76786 13.0476 5.88176C13.515 6.99566 13.6008 8.23284 13.2918 9.40062C12.9828 10.5684 12.2962 11.6012 11.3391 12.3381C10.382 13.0751 9.20799 13.4748 8.00003 13.475C7.01719 13.4741 6.05256 13.2098 5.20648 12.7097L5.20593 12.7094C5.12389 12.6637 5.03181 12.639 4.9379 12.6375L4.93747 12.6375C4.88877 12.6376 4.84029 12.6442 4.79334 12.6572L4.79313 12.6572ZM11.374 6.62616L11.3738 6.62599C11.2744 6.52746 11.14 6.47219 11 6.47219C10.86 6.47219 10.7256 6.52746 10.6262 6.62599L10.626 6.62611L9.00001 8.25833L7.37397 6.62611L7.37385 6.62599C7.27437 6.52746 7.14002 6.47219 7.00001 6.47219C6.85999 6.47219 6.72564 6.52746 6.62616 6.62599L6.62608 6.62607L4.62608 8.62607L4.62599 8.62599L4.62443 8.62789C4.54076 8.72984 4.498 8.85926 4.50447 8.99098C4.51094 9.12271 4.56618 9.24732 4.65943 9.34057C4.75269 9.43383 4.8773 9.48906 5.00902 9.49553C5.14075 9.502 5.27017 9.45924 5.37212 9.37557L5.3722 9.37567L5.37397 9.37389L7.00001 7.74167L8.62604 9.37389L8.62604 9.3739L8.62638 9.37422C8.72661 9.47114 8.86058 9.52532 9.00001 9.52532C9.13943 9.52532 9.2734 9.47114 9.37364 9.37422L9.37393 9.37393L11.3739 7.37393L11.374 7.37384C11.4725 7.27436 11.5278 7.14001 11.5278 7C11.5278 6.85999 11.4725 6.72564 11.374 6.62616ZM8.00001 1.475C6.86679 1.47491 5.75309 1.76996 4.76856 2.33109C3.78402 2.89222 2.9626 3.70008 2.38516 4.67514C1.80772 5.6502 1.49418 6.75883 1.47541 7.89189C1.45669 9.02153 1.7316 10.1366 2.27316 11.128L1.74475 12.993C1.74474 12.9931 1.74473 12.9931 1.74473 12.9931C1.69394 13.1682 1.69109 13.3538 1.73648 13.5304C1.78187 13.707 1.87384 13.8682 2.0028 13.9972C2.13176 14.1262 2.29297 14.2181 2.4696 14.2635C2.64621 14.3089 2.83176 14.3061 3.00689 14.2553C3.00691 14.2553 3.00694 14.2553 3.00697 14.2553L4.87198 13.7268C5.74192 14.2019 6.7087 14.4725 7.69893 14.5181C8.69257 14.5639 9.68352 14.3818 10.596 13.9859C11.5086 13.5901 12.3185 12.9908 12.9639 12.2339C13.6094 11.4771 14.0732 10.5827 14.32 9.61909C14.5669 8.65551 14.5901 7.64824 14.388 6.6743C14.1859 5.70035 13.7638 4.7855 13.154 3.99967C12.5442 3.21383 11.7628 2.57783 10.8695 2.14026C9.9762 1.70269 8.9947 1.47514 8.00001 1.475Z"
        fill="#0C2B47"
        stroke="#0C2B47"
        strokeWidth="0.05"
      />
    </svg>
  ),

  Ellipsis: () => (
    <svg
      height="16"
      width="16"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.38462 6.3999C2.61985 6.3999 2 7.01975 2 7.78452C2 8.54929 2.61985 9.16913 3.38462 9.16913C4.14938 9.16913 4.76923 8.54929 4.76923 7.78452C4.76923 7.01975 4.14938 6.3999 3.38462 6.3999ZM8 6.3999C7.23523 6.3999 6.61538 7.01975 6.61538 7.78452C6.61538 8.54929 7.23523 9.16913 8 9.16913C8.76477 9.16913 9.38462 8.54929 9.38462 7.78452C9.38462 7.01975 8.76477 6.3999 8 6.3999ZM12.6154 6.3999C11.8506 6.3999 11.2308 7.01975 11.2308 7.78452C11.2308 8.54929 11.8506 9.16913 12.6154 9.16913C13.3802 9.16913 14 8.54929 14 7.78452C14 7.01975 13.3802 6.3999 12.6154 6.3999Z"
        fill="#0C2B47"
      />
    </svg>
  ),

  Instagram: () => (
    <svg
      height="16"
      width="16"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.3334 1.3335H4.66671C2.82576 1.3335 1.33337 2.82588 1.33337 4.66683V11.3335C1.33337 13.1744 2.82576 14.6668 4.66671 14.6668H11.3334C13.1743 14.6668 14.6667 13.1744 14.6667 11.3335V4.66683C14.6667 2.82588 13.1743 1.3335 11.3334 1.3335Z"
        stroke="#0C2B47"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M10.6667 7.5802C10.7489 8.13503 10.6542 8.70168 10.3958 9.19954C10.1375 9.69741 9.72877 10.1011 9.22776 10.3533C8.72675 10.6055 8.15897 10.6933 7.6052 10.6042C7.05143 10.515 6.53985 10.2536 6.14323 9.85698C5.74662 9.46036 5.48516 8.94878 5.39605 8.39501C5.30694 7.84124 5.39472 7.27346 5.64689 6.77245C5.89907 6.27144 6.3028 5.86269 6.80066 5.60436C7.29853 5.34603 7.86518 5.25126 8.42001 5.33353C8.98596 5.41746 9.50991 5.68118 9.91447 6.08574C10.319 6.4903 10.5828 7.01425 10.6667 7.5802Z"
        stroke="#0C2B47"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <path
        d="M11.6666 4.3335H11.6733"
        stroke="#0C2B47"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  ),
  Whatsapp: () => (
    <svg
      height="16"
      width="16"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.83538 12.3295L5.31805 12.6115C6.13201 13.0862 7.05778 13.3354 8.00005 13.3335C9.05488 13.3335 10.086 13.0207 10.9631 12.4347C11.8402 11.8486 12.5237 11.0157 12.9274 10.0411C13.3311 9.0666 13.4367 7.99425 13.2309 6.95968C13.0251 5.92512 12.5172 4.97481 11.7713 4.22893C11.0254 3.48305 10.0751 2.9751 9.04053 2.76931C8.00597 2.56352 6.93361 2.66914 5.95907 3.07281C4.98453 3.47647 4.15158 4.16006 3.56555 5.03712C2.97951 5.91418 2.66672 6.94533 2.66672 8.00016C2.66672 8.9575 2.91805 9.8755 3.38938 10.6828L3.67072 11.1655L3.23538 12.7662L4.83538 12.3295ZM1.33605 14.6668L2.23738 11.3548C1.64347 10.3367 1.33145 9.17882 1.33338 8.00016C1.33338 4.31816 4.31805 1.3335 8.00005 1.3335C11.682 1.3335 14.6667 4.31816 14.6667 8.00016C14.6667 11.6822 11.682 14.6668 8.00005 14.6668C6.8219 14.6687 5.66449 14.3569 4.64672 13.7635L1.33605 14.6668ZM5.59405 4.87216C5.68338 4.8655 5.77338 4.8655 5.86272 4.8695C5.89872 4.87216 5.93472 4.87616 5.97072 4.88016C6.07672 4.89216 6.19338 4.95683 6.23272 5.04616C6.43138 5.49683 6.62472 5.95083 6.81138 6.40616C6.85272 6.5075 6.82805 6.6375 6.74938 6.76416C6.69528 6.84982 6.63676 6.93259 6.57405 7.01216C6.49872 7.10883 6.33672 7.28616 6.33672 7.28616C6.33672 7.28616 6.27072 7.36483 6.29605 7.46283C6.30538 7.50016 6.33605 7.55416 6.36405 7.5995L6.40338 7.66283C6.57405 7.9475 6.80338 8.23616 7.08338 8.50816C7.16338 8.5855 7.24138 8.66483 7.32538 8.73883C7.63738 9.01416 7.99072 9.23883 8.37205 9.4055L8.37538 9.40683C8.43205 9.4315 8.46072 9.44483 8.54338 9.48016C8.58472 9.4975 8.62738 9.51283 8.67072 9.52416C8.7155 9.53557 8.76266 9.53342 8.80621 9.51799C8.84977 9.50256 8.88777 9.47455 8.91538 9.4375C9.39805 8.85283 9.44205 8.81483 9.44605 8.81483V8.81616C9.47958 8.78489 9.51942 8.76115 9.56288 8.74655C9.60635 8.73194 9.65244 8.72681 9.69805 8.7315C9.73805 8.73416 9.77872 8.7415 9.81605 8.75816C10.17 8.92016 10.7494 9.17283 10.7494 9.17283L11.1374 9.34683C11.2027 9.37816 11.262 9.45216 11.264 9.5235C11.2667 9.56816 11.2707 9.64016 11.2554 9.77216C11.234 9.94483 11.182 10.1522 11.13 10.2608C11.0944 10.335 11.0472 10.403 10.9901 10.4622C10.9228 10.5328 10.8491 10.5971 10.7701 10.6542C10.7427 10.6747 10.7149 10.6947 10.6867 10.7142C10.6038 10.7668 10.5186 10.8157 10.4314 10.8608C10.2597 10.952 10.0702 11.0043 9.87605 11.0142C9.75272 11.0208 9.62938 11.0302 9.50538 11.0235C9.50005 11.0235 9.12672 10.9655 9.12672 10.9655C8.17889 10.7162 7.30231 10.2491 6.56672 9.6015C6.41605 9.46883 6.27672 9.32616 6.13405 9.18416C5.54072 8.59416 5.09272 7.9575 4.82072 7.35616C4.6815 7.06102 4.60629 6.73977 4.60005 6.4135C4.5973 6.00873 4.72961 5.61461 4.97605 5.2935C5.02472 5.23083 5.07072 5.1655 5.15005 5.09016C5.23472 5.01016 5.28805 4.9675 5.34605 4.93816C5.42317 4.89952 5.50729 4.87684 5.59338 4.8715L5.59405 4.87216Z"
        fill="#0C2B47"
      />
    </svg>
  ),
  LinkedIn: () => (
    <svg
      height="16"
      width="16"
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.62663 3.33351C4.62645 3.68713 4.48581 4.0262 4.23563 4.27613C3.98546 4.52605 3.64625 4.66636 3.29263 4.66618C2.93901 4.666 2.59994 4.52536 2.35001 4.27518C2.10009 4.02501 1.95978 3.6858 1.95996 3.33218C1.96014 2.97856 2.10078 2.63949 2.35096 2.38956C2.60113 2.13964 2.94034 1.99934 3.29396 1.99951C3.64758 1.99969 3.98665 2.14033 4.23657 2.39051C4.4865 2.64068 4.6268 2.97989 4.62663 3.33351V3.33351ZM4.66663 5.65351H1.99996V14.0002H4.66663V5.65351ZM8.87996 5.65351H6.22663V14.0002H8.85329V9.62018C8.85329 7.18018 12.0333 6.95351 12.0333 9.62018V14.0002H14.6666V8.71351C14.6666 4.60018 9.95996 4.75351 8.85329 6.77351L8.87996 5.65351V5.65351Z"
        fill="#0C2B47"
      />
    </svg>
  ),
};

export default SocialIcons;