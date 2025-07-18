import { t } from "@lingui/core/macro";
import { HiEllipsisHorizontal, HiLink, HiOutlineTrash, HiSparkles } from "react-icons/hi2";

import Dropdown from "~/components/Dropdown";
import { useModal } from "~/providers/modal";
import { useTheme } from "~/providers/theme";

const AiIcon = (props: React.SVGProps<SVGSVGElement>) => {
  const { activeTheme } = useTheme();
  const isDark = activeTheme === "dark";
  return (
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1em" height="1em" viewBox="0 0 24 24" {...props}>
      {isDark ? (
        <>
          <linearGradient id="aiicon-dark-1" x1="6.251" x2="15.749" y1="8.251" y2="17.749" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity=".6" />
            <stop offset="1" stopColor="#fff" stopOpacity=".3" />
          </linearGradient>
          <linearGradient id="aiicon-dark-2" x1="6.251" x2="15.749" y1="8.251" y2="17.749" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity=".6" />
            <stop offset=".493" stopColor="#fff" stopOpacity="0" />
            <stop offset=".997" stopColor="#fff" stopOpacity=".3" />
          </linearGradient>
          <linearGradient id="aiicon-dark-3" x1="17.387" x2="20.613" y1="3.387" y2="6.613" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity=".6" />
            <stop offset="1" stopColor="#fff" stopOpacity=".3" />
          </linearGradient>
          <linearGradient id="aiicon-dark-4" x1="17.387" x2="20.613" y1="3.387" y2="6.613" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#fff" stopOpacity=".6" />
            <stop offset=".493" stopColor="#fff" stopOpacity="0" />
            <stop offset=".997" stopColor="#fff" stopOpacity=".3" />
          </linearGradient>
        </>
      ) : (
        <>
          <linearGradient id="aiicon-light-1" x1="6.251" x2="15.749" y1="8.251" y2="17.749" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#888" stopOpacity="1" />
            <stop offset="1" stopColor="#444" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="aiicon-light-2" x1="6.251" x2="15.749" y1="8.251" y2="17.749" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#888" stopOpacity="1" />
            <stop offset=".493" stopColor="#888" stopOpacity="0" />
            <stop offset=".997" stopColor="#444" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="aiicon-light-3" x1="17.387" x2="20.613" y1="3.387" y2="6.613" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#888" stopOpacity="1" />
            <stop offset="1" stopColor="#444" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="aiicon-light-4" x1="17.387" x2="20.613" y1="3.387" y2="6.613" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#888" stopOpacity="1" />
            <stop offset=".493" stopColor="#888" stopOpacity="0" />
            <stop offset=".997" stopColor="#444" stopOpacity="1" />
          </linearGradient>
        </>
      )}
      <path fill={`url(#${isDark ? 'aiicon-dark-1' : 'aiicon-light-1'})`} d="M12.136,4.763l1.574,3.591c0.379,0.865,1.07,1.556,1.936,1.936l3.591,1.574 c0.99,0.434,0.99,1.838,0,2.271l-3.591,1.574c-0.865,0.379-1.556,1.07-1.936,1.936l-1.574,3.591c-0.434,0.99-1.838,0.99-2.271,0 L8.29,17.646c-0.379-0.865-1.07-1.556-1.936-1.936l-3.591-1.574c-0.99-0.434-0.99-1.838,0-2.271l3.591-1.574 C7.219,9.91,7.91,9.219,8.29,8.354l1.574-3.591C10.298,3.773,11.702,3.773,12.136,4.763z" />
      <path fill={`url(#${isDark ? 'aiicon-dark-2' : 'aiicon-light-2'})`} d="M11,4.521 c0.303,0,0.556,0.166,0.678,0.443l1.574,3.591c0.431,0.983,1.21,1.762,2.193,2.193l3.591,1.574 c0.277,0.122,0.443,0.375,0.443,0.678s-0.166,0.556-0.443,0.678l-3.591,1.574c-0.983,0.431-1.762,1.21-2.193,2.193l-1.574,3.591 c-0.122,0.277-0.375,0.443-0.678,0.443s-0.556-0.166-0.678-0.443l-1.574-3.591c-0.431-0.983-1.21-1.762-2.193-2.193l-3.591-1.574 C2.686,13.556,2.521,13.303,2.521,13s0.166-0.556,0.443-0.678l3.591-1.574c0.983-0.431,1.762-1.21,2.193-2.193l1.574-3.591 C10.444,4.686,10.697,4.521,11,4.521 M11,4.021c-0.459,0-0.919,0.247-1.136,0.742L8.29,8.354C7.91,9.219,7.219,9.91,6.354,10.29 l-3.591,1.574c-0.99,0.434-0.99,1.838,0,2.271l3.591,1.574c0.865,0.379,1.556,1.07,1.936,1.936l1.574,3.591 c0.217,0.495,0.676,0.742,1.136,0.742s0.919-0.247,1.136-0.742l1.574-3.591c0.379-0.865,1.07-1.556,1.936-1.936l3.591-1.574 c0.99-0.434,0.99-1.838,0-2.271l-3.591-1.574c-0.865-0.379-1.556-1.07-1.936-1.936l-1.574-3.591 C11.919,4.268,11.459,4.021,11,4.021L11,4.021z" />
      <g>
        <path fill={`url(#${isDark ? 'aiicon-dark-3' : 'aiicon-light-3'})`} d="M19.523,2.37l0.261,0.699 c0.198,0.531,0.617,0.95,1.148,1.148l0.699,0.261c0.484,0.181,0.484,0.865,0,1.045l-0.699,0.261 C20.4,5.981,19.981,6.4,19.783,6.931L19.523,7.63c-0.181,0.484-0.865,0.484-1.045,0l-0.261-0.699 C18.019,6.4,17.6,5.981,17.069,5.783L16.37,5.523c-0.484-0.181-0.484-0.865,0-1.045l0.699-0.261 c0.531-0.198,0.95-0.617,1.148-1.148l0.261-0.699C18.658,1.886,19.342,1.886,19.523,2.37z" />
        <path fill={`url(#${isDark ? 'aiicon-dark-4' : 'aiicon-light-4'})`} d="M19,2.507c0.04,0,0.049,0.024,0.054,0.038 l0.261,0.699c0.249,0.667,0.774,1.193,1.442,1.442l0.699,0.261C21.469,4.951,21.493,4.96,21.493,5s-0.024,0.049-0.038,0.054 l-0.699,0.261c-0.667,0.249-1.193,0.774-1.442,1.442l-0.261,0.699C19.049,7.469,19.04,7.493,19,7.493s-0.049-0.024-0.054-0.038 l-0.261-0.699c-0.249-0.667-0.774-1.193-1.442-1.442l-0.699-0.261C16.531,5.049,16.507,5.04,16.507,5s0.024-0.049,0.038-0.054 l0.699-0.261c0.667-0.249,1.193-0.774,1.442-1.442l0.261-0.699C18.951,2.531,18.96,2.507,19,2.507 M19,2.007 c-0.216,0-0.432,0.121-0.523,0.363l-0.261,0.699C18.019,3.6,17.6,4.019,17.069,4.217L16.37,4.477c-0.484,0.181-0.484,0.865,0,1.045 l0.699,0.261c0.531,0.198,0.95,0.617,1.148,1.148l0.261,0.699c0.09,0.242,0.306,0.363,0.523,0.363s0.432-0.121,0.523-0.363 l0.261-0.699c0.198-0.531,0.617-0.95,1.148-1.148l0.699-0.261c0.484-0.181,0.484-0.865,0-1.045l-0.699-0.261 C20.4,4.019,19.981,3.6,19.783,3.069L19.523,2.37C19.432,2.128,19.216,2.007,19,2.007L19,2.007z" />
      </g>
    </svg>
  );
};

export default function BoardDropdown({ isLoading }: { isLoading: boolean }) {
  const { openModal } = useModal();

  return (
    <Dropdown
      disabled={isLoading}
      items={[
        {
          label: t`Revise Project`,
          action: () => openModal("REVISE_PROJECT"),
          icon: <AiIcon className="h-[16px] w-[16px] text-purple-600 dark:text-purple-400" />,
        },
        {
          label: t`Edit board URL`,
          action: () => openModal("UPDATE_BOARD_SLUG"),
          icon: <HiLink className="h-[16px] w-[16px] text-dark-900" />,
        },
        {
          label: t`Delete board`,
          action: () => openModal("DELETE_BOARD"),
          icon: <HiOutlineTrash className="h-[16px] w-[16px] text-dark-900" />,
        },
      ]}
    >
      <HiEllipsisHorizontal className="h-5 w-5 text-dark-900" />
    </Dropdown>
  );
}
