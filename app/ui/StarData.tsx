// npm ls @/app/ui/fonts
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import Stars from '/public/magicstars.png'



export default function StarData() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
     <Image src={Stars} width={55} height={55} alt="star-emoji-white"/>
      <p className="text-[40px] ">StarData</p>
      
    </div>
  );
}