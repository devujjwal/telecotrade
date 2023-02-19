import { ChevronDownIcon } from '@heroicons/react/outline';
import Selectbox from '../Selectbox';

export default function TopBar({ className }) {
  return (
    <>
      <div
        className={`w-full bg-white h-10 border-b border-qgray-border ${
          className || ''
        }`}
      >
        <div className="container-x mx-auto h-full">
          <div className="flex justify-between items-center h-full">
            <div className="topbar-nav">
              <div className="flex space-x-6">
                <span className="welcome-msg text-xs leading-6 text-qblack font-500">
                  Welcome to Telecommunication Trading Germany Company Webshop!
                </span>
              </div>
            </div>
            <div className="topbar-dropdowns sm:block hidden">
              <div className="flex space-x-6">
                <div className="currency-select flex space-x-1 items-center">
                  <Selectbox className="w-fit" datas={['EURO']} />
                  <ChevronDownIcon className="h-3 w-6"></ChevronDownIcon>
                </div>
                <div className="language-select flex space-x-1 items-center">
                  <Selectbox className="w-fit" datas={['English']} />
                  <ChevronDownIcon className="h-3 w-6"></ChevronDownIcon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
