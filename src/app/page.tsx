
"use client"

import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { faExternalLink, faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { url } from "inspector";

// List of mono fonts
const FONTS = [
  'Courier New', 'Consolas', 'Lucida Console', 'Fira Code', 'JetBrains Mono',
  'Source Code Pro', 'IBM Plex Mono', 'Roboto Mono', 'Hack', 'Inconsolata',
  'Ubuntu Mono', 'Menlo', 'Monaco', 'Cascadia Code', 'Space Mono',
  'Anonymous Pro', 'Droid Sans Mono', 'PT Mono', 'Overpass Mono', 'Share Tech Mono'
];

// Descriptions to type
const DESCRIPTIONS = [
  "More than just code.",
  "There is nothing to show yet."
];

export default function Home() {
  const title = "flayyyd.dev";
  const maskRef = useRef<HTMLDivElement>(null);

  // State
  const [fonts, setFonts] = useState<string[]>([]);
  const [codeText, setCodeText] = useState<string>("");
  const [descIdx, setDescIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const [blink, setBlink] = useState(true);
  const firstSectionRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(true);

  // Mouse mask
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      maskRef.current?.style.setProperty('--x', `${e.clientX}px`);
      maskRef.current?.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', onMouse);
    return () => window.removeEventListener('mousemove', onMouse);
  }, []);

  // Initialize fonts array once
  useEffect(() => {
    setFonts(Array(title.length).fill(0).map(
      () => `${FONTS[Math.floor(Math.random() * FONTS.length)]}, monospace`
    ));
  }, [title]);

  // Randomize each letter's font every 500ms
  useEffect(() => {
    const id = setInterval(() => {
      setFonts(prev => prev.map(
        () => `${FONTS[Math.floor(Math.random() * FONTS.length)]}, monospace`
      ));
    }, 500);
    return () => clearInterval(id);
  }, []);

  // Blink underscore
  useEffect(() => {
    const bid = setInterval(() => setBlink(b => !b), 500);
    return () => clearInterval(bid);
  }, []);

  // Typing loop
  useEffect(() => {
    const desc = DESCRIPTIONS[descIdx];
    let timeout: NodeJS.Timeout;

    if (typing) {
      if (displayed.length < desc.length) {
        timeout = setTimeout(
          () => setDisplayed(desc.slice(0, displayed.length + 1)),
          150
        );
      } else {
        timeout = setTimeout(() => setTyping(false), 5000);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(
          () => setDisplayed(prev => prev.slice(0, -1)),
          100
        );
      } else {
        timeout = setTimeout(() => {
          setDescIdx((descIdx + 1) % DESCRIPTIONS.length);
          setTyping(true);
        }, 500);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, typing, descIdx]);

  // Load code text
  useEffect(() => {
    fetch('/junk-code.txt')
      .then(res => res.ok ? res.text() : Promise.reject(res.status))
      .then(setCodeText)
      .catch(console.error);
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      // true → показываем кнопку, если scrollY < 50vh
      setShowScrollBtn(window.scrollY < window.innerHeight / 4);
    };

    handleScroll(); // первый вызов при маунте
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSlideDown = () => {
    firstSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  


  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.header_bg}>
          <div ref={maskRef} className={styles.light_mask} />
          <pre className={styles.code_text}>{codeText || '// loading...'}</pre>
        </div>
        <div className={styles.header_content}>
          <h1 className={styles.title}>
            {title.split("").map((ch, i) => (
              <span key={i} style={{ fontFamily: fonts[i] }}>{ch}</span>
            ))}
          </h1>
          <p className={styles.subtitle}>
            {displayed}{blink ? '_' : ' '}
          </p>
        </div>
        <button className={`${styles.button} ${showScrollBtn ? styles.showed : ''}`} onClick={handleSlideDown}>
            Slide down
          </button>
      </div>
      <div className={styles.section} ref={firstSectionRef}>
        <div className={styles.container} id={styles.horizontal}>
          <div className={styles.info_column}>
            <div className={styles.title_separated}>About me</div>
            <div className={styles.user_avatar}><img src="/avatars/user-avatar.png" alt="" /></div>
            <div className={styles.card_wtitle}>
              <div className={styles.title}>Bio</div>
              <div className={styles.separator} />
              <div className={styles.card_content}>
                <ul>
                  <li><span>Name</span><span>→</span><span>flayyyd</span></li>
                  <li><span>y.o</span><span>→</span><span>16</span></li>
                  <li><span>Time</span><span>→</span><span>UTC+3</span></li>
                  <li><span>Lang</span><span>→</span><span>ru-RU</span></li>
                </ul>
              </div>
            </div>
            <div className={styles.card_wtitle}>
              <div className={styles.title}>Socials</div>
              <div className={styles.separator} />
              <div className={styles.card_content}>
                <div className={styles.icons_row}>
                  <img src="/icons/github.png" alt="" className={styles.icon_link} onClick={() => {window.open('https://github.com/flayyyd')}}/>
                  <img src="/icons/inst.png" alt="" className={styles.icon_link} onClick={() => {window.open('https://www.instagram.com/flayyyd/')}}/>
                  <img src="/icons/spotify.png" alt="" className={styles.icon_link} onClick={() => {window.open('https://open.spotify.com/user/31thkssnybl6cgpqqvs6qylp4v5i')}}/>
                  <img src="/icons/tme.png" alt="" className={styles.icon_link} onClick={() => {window.open('https://t.me/flayyyd')}}/>
                  <img src="/icons/vk.png" alt="" className={styles.icon_link} onClick={() => {window.open('https://vk.com/flayyyd')}}/>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.info_column}>
            <div className={styles.title_separated}>I'm a</div>
            <div className={styles.card}>
              <div className={styles.card_content}>
                # Developer <br />
                # Web-Developer <br />
                # Design Artist | UI/UX <br />
                # Freelancer
              </div>
            </div>
            <div className={styles.card_wtitle}>
              <div className={styles.title}>Tech</div>
              <div className={styles.separator} />
              <div className={styles.card_content}>
                <div className={styles.icons_row} data-cursor-hover>
                  <img src="/icons/next.png" alt="" className={styles.icon_link} />
                  <img src="/icons/react.png" alt="" className={styles.icon_link} />
                  <img src="/icons/html.png" alt="" className={styles.icon_link} />
                  <img src="/icons/css.png" alt="" className={styles.icon_link} />
                  <img src="/icons/java.png" alt="" className={styles.icon_link} />
                  <img src="/icons/typescript.png" alt="" className={styles.icon_link} />
                </div>
              </div>
            </div>
            <div className={styles.card_wtitle}>
              <div className={styles.title}>I'm using</div>
              <div className={styles.separator} />
              <div className={styles.card_content}>
              <p>PC-SPECS <br /># GTX 1660 SUPER <br /># i5-12400f <br /># Windows 11 <br />DEVICES <br /># Logitech g305 Wireless <br /># Aula f75 <br /># Logitech g435 Wireless <br /># HyperX QuadCast S <br /># Asus TUF GAMING 165hz <br />
              </p>
              </div>
            </div>
          </div>
          <div className={styles.info_column}>
            <div className={styles.title_separated}>Goals</div>
            <div className={styles.card}>
              <div className={styles.card_content}><p># Upgrade PC <br/># Upgrade Devices <br/># Get new web projects</p>
              <div className={styles.progress}>
                <div className={styles.progress_bar}></div>
                <p>47% Completed</p>
              </div>
              </div>
            </div>
            <div className={styles.title_separated}>Achievements</div>
            <div className={styles.card}>
            <div className={styles.card_content}>
              <p># FullStack Anime App<br /># First paid at 15 y.o.<br /># Closed projects for 70,000RUB <br />
              </p>
              </div>
            </div>
            <div className={styles.card_link} onClick={() => {window.open('https://t.me/flayyydtme')}}>
              <div className={styles.title}>Join my Telegram channel</div>
              <FontAwesomeIcon icon={faExternalLink} />
            </div>
            <div className={styles.card_wtitle}>
            <div className={styles.title}>Fav music</div>
              <div className={styles.separator} />
              <div className={styles.card_content}>
              <div className={styles.music_container}>
              <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={10}
              slidesPerView={"auto"}
              autoplay={{ delay: 3000 }}
              loop
            >
              <SwiperSlide className={styles.music_card_wrapper}>
                <div className={styles.music_card}>
                  <div className={styles.album_cover} style={{backgroundImage: `url("https://images.genius.com/7f0c09aaa25f755a9669bd334094c59f.1000x1000x1.png")`,}}/>
                  <div className={styles.album_info}>
                    <div className={styles.title}>Doom</div>
                    <div className={styles.artist}>zavet</div>
                  </div>
                </div>
                </SwiperSlide>
                <SwiperSlide className={styles.music_card_wrapper}>
                <div className={styles.music_card}>
                  <div className={styles.album_cover} style={{backgroundImage: `url("https://images.genius.com/ca329d066e527b5e1e0566ce8d4ab961.300x300x1.jpg")`,}}/>
                  <div className={styles.album_info}>
                    <div className={styles.title}>Office</div>
                    <div className={styles.artist}>Stopban</div>
                  </div>
                </div>
                </SwiperSlide>
                <SwiperSlide className={styles.music_card_wrapper}>
                <div className={styles.music_card}>
                  <div className={styles.album_cover} style={{backgroundImage: `url("https://images.genius.com/b5aae5ffddb70f5ac1cab2fbb7fc00a7.1000x1000x1.png")`,}}/>
                  <div className={styles.album_info}>
                    <div className={styles.title}>gotika</div>
                    <div className={styles.artist}>zavet</div>
                  </div>
                </div>
                </SwiperSlide>
                <SwiperSlide className={styles.music_card_wrapper}>
                <div className={styles.music_card}>
                  <div className={styles.album_cover} style={{backgroundImage: `url("https://images.genius.com/e6190147c9fc630d747c8a0940bef4cb.1000x1000x1.png")`,}}/>
                  <div className={styles.album_info}>
                    <div className={styles.title}>вот она</div>
                    <div className={styles.artist}>zavet</div>
                  </div>
                </div>
                </SwiperSlide>
            </Swiper>
              </div>
              </div>
            </div>
          </div>
          <div className={styles.info_column}>
            <div className={styles.banner}>
              <div className={styles.banner_upper}>
              <img className={styles.logo_psd} src="/FLAYYYD.PSD.png" alt="" />
              <p>Создание превью <br /> для вашего канала</p>
              </div>
              <div className={styles.thumbnails}>
              <img className={styles.thumbnail} src="/banners/фазмасиняя 1.png" alt="" />
              <img className={styles.thumbnail} src="/banners/pidoras.png" alt="" />
              <img className={styles.thumbnail} src="/banners/Аня покров 2.png" alt="" />
              </div>
              <div className={styles.buttons_banner}>
                <img src="/buttons/kwork.png" alt="" className={styles.button_banner} onClick={() => {window.open('https://kwork.ru/user/flayyyd')}}/>
                <img src="/buttons/tme.png" alt="" className={styles.button_banner} onClick={() => {window.open('https://t.me/flayyyddzn')}}/>
                <img src="/buttons/vk.png" alt="" className={styles.button_banner} onClick={() => {window.open('https://vk.com/flayyyddzn')}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <img src="/roadmap.png" alt="" className={styles.roadmap_img} />
      </div>
    </div>
  );
}
