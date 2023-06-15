const Icons = {
  logoSm: () => (
    <svg
      height="24"
      width="24"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 8C0 3.58172 3.58172 0 8 0H16C20.4183 0 24 3.58172 24 8V16C24 20.4183 20.4183 24 16 24H8C3.58172 24 0 20.4183 0 16V8Z"
        fill="#0C2B47"
      />
      <path
        d="M18.2002 17.2001L18.2002 11.0143C18.2002 10.1234 17.1231 9.67724 16.4931 10.3072L10.3073 16.493C9.67734 17.123 10.1235 18.2001 11.0144 18.2001L17.2002 18.2001C17.7525 18.2001 18.2002 17.7524 18.2002 17.2001Z"
        fill="white"
      />
    </svg>
  ),
  alarmBell: () => (
    <svg
      height="10"
      width="12"
      fill="none"
      viewBox="0 0 12 10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.1987 5.41763C10.1996 3.96267 9.45953 2.60729 8.23474 1.82094C7.00995 1.03447 5.4689 0.925122 4.14542 1.53072C2.82166 2.13631 1.8974 3.37354 1.69264 4.81408C1.48786 6.25448 2.03086 7.70008 3.13335 8.65022L2.79403 8.98934C2.71253 9.06515 2.66539 9.17092 2.66346 9.28217C2.6614 9.39342 2.70483 9.50083 2.78358 9.57953C2.86233 9.65823 2.96967 9.7015 3.08113 9.69958C3.19245 9.69765 3.29827 9.65054 3.37413 9.5691L3.81199 9.13151C5.11759 9.87718 6.72049 9.87718 8.0262 9.13151L8.46406 9.5691C8.62265 9.73364 8.88488 9.73859 9.04968 9.57995C9.21432 9.42144 9.21927 9.15938 9.06053 8.99468L8.72121 8.65556C9.66292 7.8434 10.2026 6.6607 10.1989 5.41766L10.1987 5.41763ZM5.92427 8.86896C5.00843 8.86896 4.13008 8.50525 3.48236 7.85806C2.83478 7.21073 2.47085 6.33292 2.47085 5.41763C2.47085 4.50219 2.83478 3.62438 3.48236 2.97719C4.13008 2.32987 5.00843 1.96629 5.92427 1.96629C6.84026 1.96629 7.71861 2.32987 8.36618 2.97719C9.0139 3.62438 9.37769 4.50219 9.37769 5.41763C9.37769 6.33348 9.01404 7.21182 8.36661 7.85999C7.71903 8.50817 6.84069 8.87297 5.92427 8.87434V8.86896Z"
        fill="#556B7E"
      />
      <path
        d="M6.14871 5.50497V3.60704C6.14871 3.38042 5.96496 3.19678 5.73819 3.19678C5.51157 3.19678 5.32782 3.38042 5.32782 3.60704V5.6691C5.32782 5.77774 5.37111 5.88213 5.44821 5.95891L6.47717 6.98725H6.47704C6.6388 7.13779 6.89086 7.13339 7.04711 6.97722C7.20351 6.82092 7.2079 6.56903 7.05714 6.4075L6.14871 5.50497Z"
        fill="#556B7E"
      />
      <path
        d="M1.55688 2.989C1.44804 2.98887 1.34372 2.9456 1.26676 2.86868C0.886469 2.48851 0.738067 1.93458 0.877145 1.41538C1.01636 0.896182 1.4222 0.490732 1.94171 0.351597C2.46122 0.212462 3.0155 0.360937 3.39576 0.740978C3.54652 0.902503 3.54212 1.15441 3.38572 1.3107C3.22946 1.46687 2.97742 1.47127 2.81565 1.32073C2.68523 1.19601 2.51179 1.12638 2.33132 1.12638C2.15086 1.12638 1.97731 1.19602 1.84699 1.32073C1.71822 1.44901 1.64593 1.62318 1.64593 1.80477C1.64593 1.98648 1.71822 2.16064 1.84699 2.2888C1.96422 2.40623 1.99927 2.58246 1.93578 2.73574C1.87228 2.88889 1.72275 2.98888 1.55685 2.98902L1.55688 2.989Z"
        fill="#556B7E"
      />
      <path
        d="M10.4503 2.98921C10.2835 2.99127 10.1319 2.8921 10.067 2.73841C10.0021 2.58471 10.0368 2.40712 10.1548 2.28901C10.2835 2.16086 10.3557 1.9867 10.3557 1.80497C10.3557 1.62339 10.2835 1.44924 10.1548 1.32094C10.0244 1.19622 9.85096 1.12659 9.67049 1.12659C9.4899 1.12659 9.31648 1.19622 9.18602 1.32094C9.02426 1.47147 8.77234 1.46707 8.61595 1.31091C8.45969 1.1546 8.45529 0.902716 8.60592 0.741184C8.89233 0.466757 9.27369 0.313477 9.67049 0.313477C10.0671 0.313477 10.4485 0.466761 10.7349 0.741184C11.0173 1.0233 11.1759 1.40595 11.1759 1.80497C11.1759 2.20398 11.0173 2.58675 10.7349 2.86889C10.6593 2.94443 10.5572 2.9877 10.4503 2.98921L10.4503 2.98921Z"
        fill="#556B7E"
      />
    </svg>
  ),

  caretdown: () => (
    <svg
      height="4"
      width="7"
      fill="none"
      viewBox="0 0 7 4"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.6665 0.833415L3.83317 3.16675L5.99984 0.833415"
        stroke="#B8BABE"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  ),

  external: () => (
    <svg
      height="15"
      width="15"
      fill="none"
      viewBox="0 0 15 15"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 2C2.73478 2 2.48043 2.10536 2.29289 2.29289C2.10536 2.48043 2 2.73479 2 3V12C2 12.2652 2.10536 12.5196 2.29289 12.7071C2.48043 12.8946 2.73478 13 3 13H12C12.2652 13 12.5196 12.8946 12.7071 12.7071C12.8946 12.5196 13 12.2652 13 12V8.5C13 8.36739 12.9473 8.24022 12.8536 8.14645C12.7598 8.05268 12.6326 8 12.5 8C12.3674 8 12.2402 8.05268 12.1464 8.14645C12.0527 8.24022 12 8.36739 12 8.5V12H3V3H6.5C6.63261 3 6.75979 2.94732 6.85355 2.85356C6.94732 2.75979 7 2.63261 7 2.5C7 2.36739 6.94732 2.24022 6.85355 2.14645C6.75979 2.05268 6.63261 2 6.5 2H3ZM12.854 2.146C12.947 2.23922 12.9994 2.36534 13 2.497V5.5C13 5.63261 12.9473 5.75979 12.8536 5.85355C12.7598 5.94732 12.6326 6 12.5 6C12.3674 6 12.2402 5.94732 12.1464 5.85355C12.0527 5.75979 12 5.63261 12 5.5V3.707L6.854 8.854C6.80751 8.90049 6.75232 8.93737 6.69158 8.96253C6.63084 8.98768 6.56574 9.00063 6.5 9.00063C6.43426 9.00063 6.36916 8.98768 6.30842 8.96253C6.24768 8.93737 6.19249 8.90049 6.146 8.854C6.09951 8.80751 6.06264 8.75232 6.03748 8.69159C6.01232 8.63085 5.99937 8.56575 5.99937 8.5C5.99937 8.43426 6.01232 8.36916 6.03748 8.30842C6.06264 8.24768 6.09951 8.19249 6.146 8.146L11.293 3H9.5C9.36739 3 9.24021 2.94732 9.14645 2.85356C9.05268 2.75979 9 2.63261 9 2.5C9 2.36739 9.05268 2.24022 9.14645 2.14645C9.24021 2.05268 9.36739 2 9.5 2H12.5C12.5657 1.99983 12.6308 2.01264 12.6916 2.03769C12.7523 2.06275 12.8075 2.09956 12.854 2.146Z"
        fill="#556B7E"
        strokeWidth={1.2}
        fillRule="evenodd"
      />
    </svg>
  ),
};

export default Icons;
