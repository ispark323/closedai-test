'use client';

import Image from 'next/image';

export default function Nav() {
  return (
    <header>
      <nav>
        <ul className="flex items-center">
          <li>
            <Image src="/sun_icon.png" alt="sun logo" width={50} height={50} />
          </li>
          <li>
            <a href="/">Weather Forecast</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
