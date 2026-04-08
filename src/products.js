import kb_main from './assets/keyboard_main.jpg';
import kb_1 from './assets/keyboard_1.jpg';
import kb_2 from './assets/keyboard_2.jpg';
import kb_3 from './assets/keyboard_3.jpg';
import hp_main from './assets/headphones_main.jpg';
import hp_1 from './assets/headphones_1.jpg';
import hp_2 from './assets/headphones_2.jpg';
import hp_3 from './assets/headphones_3.jpg';
import k_main from './assets/k_main.jpg';
import k_1 from './assets/k_1.jpg';
import k_2 from './assets/k_2.jpg';
import k_3 from './assets/k_3.jpg';
import red_main from './assets/red_main.webp';
import r_1 from './assets/red_1.webp';
import r_2 from './assets/red_2.webp';
import r_3 from './assets/red_3.jpg';
import m_main from './assets/mouse_main.jpg';
import m_1 from './assets/mouse_1.jpg';
import m_2 from './assets/mouse_2.webp';
import m_3 from './assets/mouse_3.webp';
export const PRODUCTS = [
  {
    id: 1,
    name: "Słuchawki bezprzewodowe",
    price: 599.00,
    category: "Słuchawki",
    color: 'Czarny',
    image: hp_main,
    images: [
              hp_main,
              hp_1,
              hp_2,
              hp_3
    ],
    description: "Najlepsze na rynku słuchawki z aktywną redukcją szumu. Idealne do pracy i podróży."
  },
  {
    id: 2,
    name: "Klawiatura bezprzewodowa",
    price: 149.00,
    category: "Klawiatury",
    color: 'Biały',
    image: kb_main,
    images: [
              kb_main,
              kb_1,
              kb_2,
              kb_3
    ],
    description: "Ciche i równo pracujące przełączniki, podświetlane klawisze i aluminiowa obudowa. Komfort pisania na najwyższym poziomie."
  },
  {
    id: 3,
    name: "Klawiatura Membranowa",
    price: 249.00,
    category: "Klawiatury",
    color: 'Czarny',
    image: k_main,
    images: [
              k_main,
              k_1,
              k_2,
              k_3
    ],
    description: "Cicha i niezawodna, podświetlane klawisze i mocna konstrukcja. Komfort pisania i użytkowania gwarantowany!"
  },
  {
    id: 4,
    name: "Klawiatura Redragon",
    price: 449.00,
    category: "Klawiatury",
    color: 'Biały',
    image: red_main,
    images: [
              red_main,
              r_1,
              r_2,
              r_3
    ],
    description: "Cicha i niezawodna, podświetlane klawisze i mocna konstrukcja. Komfort pisania i użytkowania gwarantowany!"
  },
  {
    id: 5,
    name: "Myszka logitech",
    price: 349.00,
    category: "Myszki",
    color: 'Czarny',
    image: m_main,
    images: [
              m_main,
              m_1,
              m_2,
              m_3
    ],
    description: "LOGITECH G Pro 2 Lightspeed to mysz gamingowa, która stawia na niezawodność i wyjątkową dokładność. Dzięki czujnikowi HERO 2 gwarantuje imponującą czułość na poziomie od 100 do 44 000 DPI, co sprawia, że każda reakcja jest precyzyjna. Maksymalna szybkość rejestrowania 500 IPS i przyspieszenie powyżej 40 G oznaczają, że myszka nadąży za Twoimi ruchami bez opóźnień."
  },


];
