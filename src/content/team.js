// Copy for the /about page. Kept as plain data so it can move to Sanity later.
// Placeholders in [square brackets] are intentional, so they're easy to find.

/**
 * @typedef {Object} TimelineEntry
 * @property {string} years
 * @property {string} title
 * @property {string} description
 */

/**
 * @typedef {Object} TeamMember
 * @property {string} id
 * @property {string} name
 * @property {"cyan" | "magenta"} accent
 * @property {string} role
 * @property {string} shortBio
 * @property {{ src: string, alt: string } | null} photo  null shows the placeholder
 * @property {string} profileSubtitle
 * @property {TimelineEntry[]} career
 * @property {string} [credits]
 * @property {TimelineEntry[]} [education]
 */

export const aboutHero = {
  eyebrow: "About Us",
  title: "The People Behind the",
  titleHighlight: "Pulses",
  subtitle:
    "Two sound engineers, one obsession: turning mathematics into reverb that plays in key.",
};

export const profilesSection = {
  eyebrow: "Full profiles",
  title: "Experience & background",
};

export const aboutCta = {
  title: "Hear the method",
  text: "Each collection represents a different approach to harmonic sequence control of sources, from natural acoustic elements to algorithmic noise profiles. All IRs are harmonically tuned to ensure your reverb is not just heard, but felt as a musical extension of your sound.",
  buttonLabel: "Explore Collections",
  href: "/collections",
};

/** @type {TeamMember[]} */
export const team = [
  {
    id: "antonio",
    name: "António Pinheiro da Silva",
    accent: "cyan",
    role: "CO-FOUNDER · CREATOR OF THE METHOD",
    shortBio:
      "One of the most influential sound engineers in Portuguese music. Trained at Abbey Road in 1982, he has spent more than four decades behind the console — recording Madredeus, Dulce Pontes, António Variações, Rui Veloso, GNR and Camané, and mixing more than 3000 concerts around the world. A lifelong researcher in acoustics, music and mathematics, he created the method and software behind every Trim Pulses impulse.",
    photo: {
      src: "/images/FotosBio/testA.jpg",
      alt: "António Pinheiro da Silva",
    },
    profileSubtitle: "SOUND ENGINEER · PRODUCER · RESEARCHER · EDUCATOR",
    career: [
      {
        years: "1990 – present",
        title: "Independent sound engineer & producer",
        description:
          "Recording, mixing, mastering and production for more than three decades — including the mastering of Madredeus' complete discography (8 CDs), José Afonso's classic albums (Cantigas do Maio, Traz Outro Amigo Também, Contos Velhos Rumos Novos, Cantares do Andarilho, Eu Vou Ser Como a Toupeira) and António Chainho, as well as new voices such as Criatura, A Naifa and DJ Marfox",
      },
      {
        years: "1997 – present",
        title: "Dulce Pontes",
        description:
          "Live sound engineer for about 500 concerts (1997–2003 and from 2009); produced, recorded, mixed and mastered O Primeiro Canto (1999) — also arranging three of its songs and co-writing the title track — and was executive producer, mixer and mastering engineer of the double album Momentos (2009)",
      },
      {
        years: "1990 – 2002",
        title: "Madredeus",
        description:
          "Produced Existir (1990); mixed Lisboa (live at the Coliseu, 1992), O Espírito da Paz (1994), Ainda (1995), Movimento (2001) and the Euforia DVD (2002). Live sound for more than 350 concerts in around 20 countries, from Tokyo and Rio de Janeiro to Toronto and Los Angeles (1990–1996)",
      },
      {
        years: "1998 – 2010",
        title: "Camané",
        description:
          "Nine records over twelve years, from Na Linha da Vida (1998) to Do Amor e dos Dias (2010), including Esta Coisa da Alma, Pelo Dia Dentro, Como Sempre… Como Dantes, Sempre de Mim and the live recordings at São Luiz and Coliseu",
      },
      {
        years: "2002 – 2012",
        title: "Fado & new Portuguese music",
        description:
          "Carlos do Carmo & Bernardo Sassetti; Teresa Salgueiro (O Mistério — recorded, mixed and produced, 2012); Helder Moutinho (produced Que Fado É Este Que Trago, 2008); Mafalda Arnauth (Diário); Joana Amendoeira; Aldina Duarte (Contos de Fados); Amor Electro (Cai o Carmo e a Trindade); Lula Pena (Troubadour)",
      },
      {
        years: "1991 – 2009",
        title: "Mixing & production",
        description:
          "Resistência (Palavras ao Vento, Mano a Mano, and the live Armazém 22 album, which he produced); José Mário Branco (JMB ao Vivo, Resistir é Vencer); Danças Ocultas (three albums); Amélia Muge (four records); Sérgio Godinho (Tinta Permanente); Rodrigo Leão (produced Ave Mundi Luminar, 1993); Pascal Gaigne; Corvos",
      },
      {
        years: "1984 – present",
        title: "Live sound — other artists",
        description:
          "Trovante (1984–1987), Resistência (every concert of 1992–1993), José Mário Branco, Camané, Joana Amendoeira (since 2008), Mafalda Arnauth, Maria João & Mário Laginha with the Stavanger Symphony Orchestra; New Year's Eve at Terreiro do Paço (TV broadcast 1991, FOH director 1992); Festa do Fado at Castelo de São Jorge (2007–2011)",
      },
      {
        years: "1995 – 2012",
        title: "Teaching",
        description:
          "Recording, mixing and acoustics at EPMA, ETIC, EPI, Academia de Música de Lisboa and ESMAE, where he led live-sound residencies and examined final projects for over a decade; tutor of sound engineers at Expo 98; speaker at the PTM conferences on the history and future of professional audio in Portugal",
      },
      {
        years: "1998 – 2012",
        title: "Acoustics & software",
        description:
          "Sound projects for Expo 98 (Aquamatrix, Praça Sony) and Guimarães European Capital of Culture 2012; room acoustics for Hard Club, Casino da Madeira and Estúdio Fuga; system calibration for Teatro Circo in Braga and Centro Cultural Olga Cadaval in Sintra; author of Virtual Rooms, software for room analysis and sound calculations",
      },
      {
        years: "1985 – 1989",
        title: "Jorge Palma",
        description:
          "Mixed O Lado Errado da Noite (1985) and Quarto Minguante (1986); produced Bairro do Amor (1989); flute on Mancha de Café",
      },
      {
        years: "1986 – 1990",
        title: "Technical director — Namouche Studios",
        description:
          "Fausto (Para Além das Cordilheiras, A Preto e Branco), Paulo de Carvalho, Paulo Gonzo, Delfins, Lena d'Água",
      },
      {
        years: "1980 – 1986",
        title: "Sound engineer — Valentim de Carvalho Studios",
        description:
          "António Variações (Estou Além, Dar e Receber); Rui Veloso (Fora de Moda, Guardador de Margens); GNR (Independança, Os Homens Não Se Querem Bonitos); Heróis do Mar (Mãe); Sétima Legião (A Um Deus Desconhecido); Trovante; UHF; Rádio Macau; Vitorino; Janita Salomé; The Durutti Column",
      },
      {
        years: "1970 – 1982",
        title: "Musician & research technician",
        description:
          "Guitar and flute with Perspectiva and Banda do Casaco (Hoje Há Conquilhas, Amanhã Não Sabemos; Contos da Barbearia; No Jardim da Celeste; Também Eu) — and later flute and guitar on records by Jorge Palma, Rodrigo Leão and Sérgio Godinho. Research technician at university laboratories in Lisbon, coordinating the technical services of the Faculty of Sciences and Technology",
      },
    ],
    education: [
      {
        years: "1982",
        title: "Abbey Road Studios, London",
        description:
          "Trained under Ken Townsend, Peter Vince, Francis Dillnutt and Alan Parsons",
      },
      {
        years: "1969",
        title: "National Conservatory of Music, Lisbon",
        description:
          "Two years of the general music course; transverse flute with Luís Hayes Boulton",
      },
      {
        years: "1968 – 1970",
        title: "Chemical Engineering — Instituto Superior Técnico",
        description: "Two years of study",
      },
    ],
    credits:
      "Madredeus, Dulce Pontes, José Mário Branco, Sérgio Godinho, Fausto, António Variações, Rui Veloso, GNR, Camané, Carlos do Carmo, Jorge Palma, Rodrigo Leão, Heróis do Mar, Sétima Legião, Trovante, Rádio Macau, UHF, Lena d'Água, Teresa Salgueiro, Danças Ocultas, Resistência, The Durutti Column and many others.",
  },
  {
    id: "paulo",
    name: "Paulo Lourenço",
    accent: "magenta",
    role: "CO-FOUNDER · SOUND ENGINEER",
    shortBio:
      "Sound engineer and musician with 20 years of experience in the studio, on festival stages and in TV broadcast — from recordings with Sérgio Godinho and Diabo na Cruz to live broadcasts of Rock in Rio, NOS Alive and the UEFA Champions League. He is also the bassist, producer and technical director of the band Criatura. At Trim Pulses he works alongside António and built everything around them: the website, the visuals and the video.",
    photo: {
      src: "/images/FotosBio/testB.png",
      alt: "Paulo Lourenço",
    },
    profileSubtitle: "SOUND ENGINEER · BROADCAST AUDIO · MUSICIAN · EDUCATOR",
    career: [
      {
        years: "2025 – present",
        title: "Co-owner — DTX · Discotexas studio",
        description:
          "Recording, mixing and production studio run in partnership with Pedro Gerardo and Hugo Valverde",
      },
      {
        years: "2019 – present",
        title: "TV audio — SIC, RTP, CMTV",
        description:
          "Recording, audio post-production and broadcast sound for live and recorded entertainment shows — including Taskmaster (RTP) — award ceremonies such as the Globos de Ouro, football from the Portuguese league to the UEFA Champions League, podcasts and advertising, plus festival broadcasts from Rock in Rio, NOS Alive, Paredes de Coura, Vilar de Mouros and MEO Kalorama",
      },
      {
        years: "2017 – 2019",
        title: "Founder — Ar de Estúdio",
        description:
          "Recording studio integrated into the Boutique da Cultura cultural space",
      },
      {
        years: "2016 – present",
        title: "Live sound & technical direction",
        description:
          "FOH engineer for Luciana Abreu (since 2024); technical director and FOH engineer for Soluna (2018–2021); FOH engineer for Iolanda (2020); technical director for Beatriz Pessoa with Arruada (2016–2017); live sound for Royal Bermuda, Cows Caos, Pás de Problème, Charanga, Roda Ibérica, AiÊ and others",
      },
      {
        years: "2014 – present",
        title: "Bassist, Producer & technical director — Criatura",
        description:
          "Co-founder of the band; about ten years of shows, often as headliners — Tivoli, Capitólio, Teatro Maria Matos, FMM Sines, Bons Sons, Festa do Avante, Raízes do Atlântico, and many others",
      },
      {
        years: "1998 – present",
        title: "Musician",
        description:
          "Bass with Os Compotas, Los Negros, Trashcan and My Kicks in 66; trombone with Sabrosas Funk and Capela Jazz Quartet",
      },
      {
        years: "2014 – 2016",
        title: "Music documentation & concert reviews",
        description:
          "Mural Sonoro (Lisbon): recorded conversations with key figures in the history of Portuguese music and managed the archive; Som Direto, the online magazine of Rádio Alvor: wrote concert reviews",
      },
      {
        years: "2012 – 2018",
        title: "Vice-president — Contramaré",
        description:
          "Cultural association: produced film cycles, concerts, music festivals, art and craft fairs, heritage projects, and short-film and photography competitions",
      },
      {
        years: "2009 – 2024",
        title: "Film & web series",
        description:
          "Mixing and mastering for the short films Aqui Jaz a Minha Casa, Intervenção Divina and Braço Frito, and for the original soundtrack of the documentary João Ayres, an Independent Painter; sound for the YouTube series Mudar para Melhor",
      },
      {
        years: "2009 – 2019",
        title: "Teaching & workshops",
        description:
          'Audio trainer at ETIC_Algarve (Sound for Film and Audio Technologies, 2017–2019); co-created and taught the "Introduction to Audio Production" workshops in Lisbon and Porto with Mike Simões; six years teaching music in primary schools in Portimão and Lisbon',
      },
      {
        years: "2007 – 2008",
        title: "Radio producer — Radio Cardiff",
        description: "Audio editing and post-production; composed jingles",
      },
      {
        years: "2006 – present",
        title: "Freelance sound engineer",
        description:
          "Recording, editing, mixing and mastering, front-of-house and monitors — mixed and mastered the albums of Royal Bermuda and Pás de Problème; worked with Sérgio Godinho, Diabo na Cruz, Beatriz Pessoa, Sarah Negra, Cristina Clara and others; live sound for Fredrick Stanley Star and Serpentine in the UK; now based at DTX · Discotexas",
      },
      {
        years: "2004 – 2008",
        title: "3D visualisation — Cardiff",
        description:
          "Freelance architecture and product-design pre-visualisations, as stills and video, in Maya, 3ds Max and Cinema 4D",
      },
    ],
    education: [
      {
        years: "2010",
        title: "Music for children",
        description: "Meloteca, Lisbon",
      },
      {
        years: "2009",
        title: "Certified trainer (CAP)",
        description: "Algarve Film Commission, Faro",
      },
      {
        years: "2005 – 2009",
        title: "BSc (Hons) Music & Technology",
        description: "University of Glamorgan, Cardiff",
      },
    ],
    credits:
      "Sérgio Godinho, Diabo na Cruz, Beatriz Pessoa, Soluna, Iolanda, Luciana Abreu, Cristina Clara, Royal Bermuda, Pás de Problème, Cows Caos, Sarah Negra, Charanga, Roda Ibérica, AiÊ, Criatura, Fredrick Stanley Star, Serpentine and many others.",
  },
];
