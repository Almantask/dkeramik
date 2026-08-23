import type { SiteTranslations } from './types';

export const lt: SiteTranslations = {
  nav: {
    home: 'Pradžia',
    about: 'Apie mane',
    portfolio: 'Portfolio',
    shop: 'Parduotuvė',
    cart: 'Krepšelis',
    craft: 'Kūryba',
    journal: 'Minčių koštuvas',
    contact: 'Susisiekime',
  },

  home: {
    headline: 'Namai tampa tikrais namais,\nkai juose atsiranda širdžiai mielos detalės.',
    introText:
      'Namai kiekvienam iš mūsų reiškia kažką skirtingo. Man jie kuriami iš prisiminimų, tradicijų, šilumos ir mažų detalių, kurios pamažu pripildo erdvę gyvybės.',
    ctaPortfolio: 'Portfolio',
    ctaAbout: 'Apie',
  },

  about: {
    quote: 'Namai kuriami po truputį – detalė po detalės.',
    greeting: 'Labas, aš Donata.',
    story:
      'Augdama mačiau, kaip mama mūsų namus pripildydavo rankų darbo keramikos kūriniais iš vietinių kūrėjų — mažomis dėžutėmis, angelų skulptūrėlėmis ir kitais daiktais, turinčiais savo charakterį ir sielą. Iš jos išmokau, kad rankų darbo daiktai turi ypatingą galią — jie į kasdienybę atneša ne tik grožį, bet ir jaukumą, nuotaiką bei prasmę.',
    mission:
      'Per DKeramik siekiu tęsti šią mintį — kurti keramiką, kuri primena, kad būtent mažos detalės praturtina gyvenimą.',
    journey:
      'Į keramiką atėjau po darbo ir kasdienybės ofise. Atėjo diena, kai pagalvojau, kad svajonė pagaliau dirbti savo rankomis vis didėja ir plečiasi širdyje, galvoje užimdama vis daugiau vietos. Su dideliu, meilės kupinu palaikymu — atėjo drąsa palikti Vilnių, darbą, viską ką kūriau tiek metų. Dabar gyvenu Kaune ir save toliau pažįstu per keramiką.',
    inspiration:
      'Mane įkvepia Lietuva, kraštas, kurį vadinu namais. Gamtos tekstūros, skirtingų metų laikų pokytis, besikeičiantis apšvietimas ir šešėliai, ugnies jaukumas, vanduo visomis savo formomis: lėtai tekanti upė, plati jūra, žali ežerai ir skaidrūs šaltiniai. Ramybę randu gamtoje, jos ritme, žalumoje, augaluose ir paukščiuose, kurie kiekvieną metų laiką nuspalvina vis kitaip. Šis paprastumas ir gylis formuoja mano kūrybą.',
    hope:
      'Tikiuosi, kad kiekvienas mano kūrinys taps daugiau nei tik objektu – maža džiaugsmo kibirkštimi ir jaukia Tavo namų istorijos dalimi.',
    contactPrompt:
      'Jei turi klausimų apie konkretų kūrinį, domina individualus užsakymas, ar tiesiog nori pasikalbėti apie keramiką ir kūrybą — laukiu Tavo žinutės',
    contactLinkText: 'Susisiekime',
  },

  portfolio: {
    headline: 'Portfolio',
    subheadline:
      'Kiekvienas kūrinys sukurtas rankomis su intencija. Skirtas kasdieniniam naudojimui, ilgaamžis, atsinešantis šilumą į Tavo namus.',
    categoryAll: 'Visi',
    categoryBowls: 'Dubenėliai',
    categoryCups: 'Puodeliai',
    categoryVases: 'Vazos',
    categorySmallDecor: 'Mažos detalės',
    categoryKeepsakes: 'Atminimo daiktai',
    categorySeasonal: 'Sezoniniai',
    emptyState: 'Šioje kategorijoje kūrinių kol kas nėra.',
  },

  product: {
    categoryLabel: 'Kategorija',
    dimensionsLabel: 'Matmenys',
    materialLabel: 'Medžiaga',
    careLabel: 'Priežiūra',
    handmadeNoteTitle: 'Rankų darbo ypatybė',
    handmadeNoteBody:
      'Kiekvienas kūrinys yra individualiai sukurtas, todėl nedideli dydžio, formos ir glazūros skirtumai yra natūralūs ir džiugina. Tavo kūrinys bus unikaliai gražus.',
    backToPortfolio: '← Grįžti į portfolio',
  },

  craft: {
    headline: 'Kūryba',
    subheadline:
      'Nuo žalios žemės iki gatavo kūrinio – kiekvienas dirbinys praeina pro kantrias rankas ir transformuojančią ugnį.',
    intro:
      'Keramika nėra skubota. Ji prašo laiko, dėmesio ir pagarbos medžiagai. Kiekvienas žingsnis – nuo molio parinkimo iki paskutinio degimo – turi savo tempą ir savo tiesą.',
    steps: [
      {
        title: 'Molio parinkimas',
        description:
          'Viskas prasideda nuo medžiagos. Skirtingi moliai suteikia skirtingą faktūrą, svorį ir charakterį. Renkuosi molį pagal tai, ką norisi sukurti.',
      },
      {
        title: 'Centravimas',
        description:
          'Centravimas reikalauja kantrybės – molis turi tapti ramiu, lygiu, nuolankiu. Tik tada galima pradėti formuoti.',
      },
      {
        title: 'Formavimas',
        description:
          'Rankos seka molį, molis seka rankas. Forma atsiranda iš dialogo – tarp idėjos ir medžiagos, tarp norimo ir galimo.',
      },
      {
        title: 'Apdirbimas',
        description:
          'Nudžiūvęs kūrinys grįžta ant rato – apipjaunamas, tobulinamas, suteikiamas galutinis kontūras. Detalės nusprendžia viską.',
      },
      {
        title: 'Džiovinimas',
        description:
          'Lėtas džiovinimas yra taip pat svarbus kaip ir formavimas. Skubėjimas čia brangiai kainuoja – molis turi laiko džiūti savaime.',
      },
      {
        title: 'Glazūravimas',
        description:
          'Glazūra – tai kūrinio „oda". Ji suteikia spalvą, faktūrą, charakterį. Renkuosi glazūras, kurios atspindi žemę – tylias, šiltas, gyvybingas.',
      },
      {
        title: 'Degimas',
        description:
          'Krosnyje vyksta transformacija. Molis tampa akmeniu, glazūra išsilydoma ir sukietėja. Po degimo kūrinys nebepriklauso man – jis ateina į pasaulį.',
      },
      {
        title: 'Paskutinis prisilietimas',
        description:
          'Kiekvienas gatavs kūrinys yra apžiūrimas, liečiamas, vertinamas. Jei jis suteikia džiaugsmo – jis keliauja pas Tave.',
      },
    ],
    processLabels: ['Centravimas', 'Formavimas', 'Degimas', 'Tobulinimas'],
    closing: 'Grožis slypi netobulumuose.',
  },

  journal: {
    headline: 'Minčių koštuvas',
    subheadline: 'Mintys apie kūrybą, gyvenimą ir keramikos užkulsiai.',
    readMore: 'Skaityti daugiau →',
    backToJournal: '← Grįžti į minčių koštuvą',
    entries: [
      {
        slug: 'behind-the-glaze',
        title: 'Už glazūros: kas vyksta dirbtuvėje',
        date: '2024 m. kovo 23 d.',
        excerpt:
          'Keramikos kūrimas – tai ne tik rezultatas. Tai procesas, pilnas netikėtumų, atradimų ir tylios kūrybos džiaugsmo.',
        body: [
          'Kiekvieną rytą, kai ateinu į dirbtuvę, pirmas dalykas – prisilietimas prie molio. Tai tarsi pasisveikinimas. Molis yra šaltas, drėgnas, pilnas galimybių.',
          'Daugelis žmonių mato tik gatavą kūrinį – gražų, glazūruotą, paruoštą. Bet tikroji magija vyksta tarp šių etapų: kai molis lūžta ir reikia pradėti iš naujo, kai glazūra nustebina netikėta spalva, kai krosnies temperatūra nusprendžia viską.',
          'Šiandien norėjau pasidalinti tuo, kas lieka už uždarų dirbtuvės durų. Tais momentais, kai rankos žino daugiau nei galva. Kai kūrinys pats pasirenka savo formą.',
          'Keramika moko kantrybės. Ji moko priimti netobulumą kaip dovaną. Ir svarbiausia – ji moko, kad kūryba yra kelionė, ne tikslas.',
        ],
      },
      {
        slug: 'home-rituals',
        title: 'Namų ritualai: daiktai, formuojantys mūsų dienas',
        date: '2024 m. kovo 15 d.',
        excerpt:
          'Kaip paprastas pasiekimas po rankų darbo puodeliu rytą gali paversti įprastą rytą sąmoningo buvimo akimirka.',
        body: [
          'Yra kažkas magiško rytinėje kavos ceremonijoje. Ne dėl kofeino – nors ir jis padeda – bet dėl paties akto: kėtimasis, vandens pildymas, puodelio paėmimas.',
          'Kai tas puodelis yra rankų darbo, šiltas, šiek tiek nereguliarus, nešantis savo kūrėjo pirštų antspaudą – kažkas pasikeičia. Paprastas rytas tampa truputį sakralesnis.',
          'Mes gyvename tarp daiktų. Jie formuoja mūsų judesius, mūsų ritualus, mūsų jausmus. Rankų darbo daiktas primena, kad kažkas skirio laiko jį sukurti. Ir tas laikas, ta intencija – ji perduodama Tau per patį daiktą.',
          'Tad rytą, kai išsitiesinsite po puodelį – pastebėkite jį. Pajuskite jo svorį. Jo šilumą. Jo unikalumą. Leiskite tai šiai mažai detalei padaryti Tavo dieną truputį gražesnę.',
        ],
      },
      {
        slug: 'warmth-of-clay',
        title: 'Molio šiluma: kodėl rankų darbas svarbus',
        date: '2024 m. vasario 28 d.',
        excerpt:
          'Masines gamybos pasaulyje rankų darbo pasirinkimas yra tylaus pasipriešinimo – ir gilaus ryšio – aktas.',
        body: [
          'Kai laikote rankų darbo keramikos kūrinį, jūs laikote kažko daugiau nei tik objektą. Jūs laikote laiką. Sprendimą. Rankų judesius, kurie kūrė formą.',
          'Masinis gamybas gaminys yra tobulas – identiškas kiekvienam kitam tokios pat formos gaminiui. Jis neturi biografijos. Rankų darbo kūrinys turi mažų netobulumų – šiek tiek asimetriška ranka, glazūros srauto pėdsakas, vieta, kur pirštai paliko žymę ant šlapio molio.',
          'Tie netobulumu – tai ne defektai. Tai įrodymas, kad kažkas, turintis rankas ir širdį, sukūrė tai, ką dabar laikote.',
          'Pasirinkdami rankų darbą, jūs palaikote ne tik amatininką. Jūs palaikote idėją, kad daiktai gali turėti prasmę. Kad grožis gali būti žmogiškas. Kad namų aplinka gali jaustis ne kaip katalogas, bet kaip gyvenama istorija.',
        ],
      },
      {
        slug: 'handmade-details',
        title: 'Rankų darbo detalės: namai, kurie jaučiasi kaip Tu',
        date: '2024 m. kovo 8 d.',
        excerpt:
          'Tavo namai neprivalo būti tobuli. Jie turi būti pripildyti daiktų, kurie Tave priverčia kažką pajusti.',
        body: [
          'Intervalų žurnaluose pilna tobulų namų. Tobulusias sofa, tobulai suderinti pagalvėliai, tobulai išdėstyti kaktusai. Ir kažkaip – visi jie atrodo vienodai.',
          'Tikri namai atrodo kitaip. Juose yra žlugusios lentynos knygų, kurias myli. Puodelis, gautas per gimtadienį. Dubenėlis, nupirktas iš keramikės, su kuria kalbėjotės dvidešimt minučių apie molį ir gyvenimą.',
          'Tie daiktai pasakoja Tavo istoriją. Jie yra Tavo namų melodija – unikali, neatkartojama, visiškai Tavo.',
          'Todėl kiekvieną kūrinį kuriu su mintimi: galbūt tai taps kažko namų istorijos dalimi. Galbūt ši vaza stovės kambaryje, kur vaikų juokas skamba. Galbūt šis puodelis kiekvieną rytą bus po kažkieno ranka.',
          'To man pakanka. Tai yra prasmė.',
        ],
      },
    ],
  },

  contact: {
    headline: 'Susisiekime',
    subheadline: 'Turi klausimų, idėjų individualiam užsakymui, ar tiesiog nori pasikalbėti apie keramiką? Laukiu Tavo žinutės.',
    nameLabel: 'Vardas',
    namePlaceholder: 'Tavo vardas',
    emailLabel: 'El. paštas',
    emailPlaceholder: 'tavo@elpaštas.lt',
    messageLabel: 'Žinutė',
    messagePlaceholder: 'Tavo žinutė...',
    sendButton: 'Siųsti žinutę',
    successMessage: 'Tavo žinutė paruošta. Prašome išsiųsti ją per el. pašto programą.',
  },

  shop: {
    title: 'Parduotuvė',
    intro: 'Rankų darbo kūriniai, kuriuos galima įsigyti dabar. Kainos ir likučiai atnaujinami gyvai — kiekvienas daiktas unikalus.',
    price: 'Kaina',
    stock: 'Likutis',
    inStock: 'Yra',
    soldOut: 'Išparduota',
    addToCart: 'Į krepšelį',
    addedToCart: 'Pridėta į krepšelį',
    viewCart: 'Krepšelis',
    backToShop: 'Grįžti į parduotuvę',
    apiUnavailable: 'Parduotuvė laikinai nepasiekiama. Gali parašyti man el. paštu.',
    notForSale: 'Šis kūrinys rodomas tik portfolio galerijoje.',
  },

  cart: {
    title: 'Krepšelis',
    empty: 'Krepšelis tuščias.',
    quantity: 'Kiekis',
    remove: 'Pašalinti',
    subtotal: 'Suma',
    checkout: 'Užsakyti',
    continueShopping: 'Tęsti apsipirkimą',
    stockCap: 'Liko tik {stock} vnt. — kiekis pataisytas.',
  },

  checkout: {
    title: 'Užsakymas',
    name: 'Vardas',
    email: 'El. paštas',
    phone: 'Telefonas',
    delivery: 'Pristatymas',
    pickup: 'Atsiėmimas Kaune (nemokamai)',
    pickupHint: 'Laiką suderinsime el. paštu po apmokėjimo.',
    shipping: 'Siuntimas Lietuvoje',
    shippingHint: 'Fiksuotas tarifas Lietuvos adresu.',
    international: 'Pristatymas į užsienį derinamas el. paštu — naudokite kontaktų formą.',
    address: 'Adresas',
    city: 'Miestas',
    postalCode: 'Pašto kodas',
    submit: 'Pateikti užsakymą',
    submitting: 'Siunčiama…',
    errorStock: 'Dalies prekių nebeliko. Krepšelis atnaujintas.',
    errorGeneric: 'Nepavyko pateikti užsakymo. Bandykite dar kartą arba rašykite el. paštu.',
    mailtoFallback: 'Siųsti užsakymą el. paštu',
    shippingTotal: 'Siuntimas',
    requiredHint: 'Privalomi laukai pažymėti *.',
  },

  confirmation: {
    title: 'Ačiū',
    pending: 'Sąskaita laukia apmokėjimo.',
    paid: 'Mokėjimas gautas. Ačiū.',
    invoice: 'Sąskaitos numeris',
    amount: 'Suma',
    payCta: 'Mokėti per savo banką (Paysera)',
    iban: 'IBAN rankiniam pavedimui',
    purpose: 'Mokėjimo paskirtis',
    rights: 'Turite teisę per 14 dienų nuo prekių gavimo atsisakyti nuotolinės sutarties, išskyrus individualiai pagal Jūsų nurodymus pagamintus kūrinius. Žr. Grąžinimai.',
    downloadInvoice: 'Atsisiųsti sąskaitos PDF',
    loading: 'Kraunamas užsakymas…',
    notFound: 'Užsakymas nerastas.',
  },

  legal: {
    termsTitle: 'Pardavimo sąlygos',
    termsBody: [
      'Pardavėjas: DKeramik, individuali veikla Lietuvoje. Susisiekimui: info@dkeramik.lt.',
      'Šios sąlygos taikomos nuotoliniam rankų darbo keramikos pardavimui per dkeramik.lt. Pateikdami užsakymą sutinkate apmokėti sąskaitą eurais.',
      'Atsiskaitymas pavedimu (Paysera banko nuoroda arba SEPA, paskirtyje nurodant sąskaitos numerį). PVM netaikomas, kol pardavėjas nėra PVM mokėtojas.',
      'Atsiėmimas Kaune nemokamas. Siuntimas Lietuvoje — fiksuotas tarifas, matomas užsakymo lange. Siuntimas į užsienį derinamas atskirai.',
      'Kiekvienas kūrinys rankų darbo; nedideli dydžio, spalvos ir glazūros skirtumai yra kūrinio dalis, o ne defektas.',
      'Sutartis sudaroma, kai patvirtiname užsakymą ir išrašome sąskaitą. Neapmokėtą užsakymą galime atšaukti ir grąžinti prekes į sandėlį.',
    ],
    returnsTitle: 'Grąžinimai ir atsisakymas',
    returnsBody: [
      'Nuotoliniams pirkimams turite 14 dienų nuo pristatymo (ar atsiėmimo) atsisakyti sutarties nenurodydami priežasties, pagal Lietuvos vartotojų teisę.',
      '14 dienų teisė netaikoma aiškiai individualizuotiems ar pagal Jūsų užsakymą pagamintiems kūriniams.',
      'Norėdami atsisakyti, rašykite info@dkeramik.lt ir nurodykite sąskaitos numerį. Grąžinkite nenaudotas prekes savo lėšomis, supakuotas taip, kad nesudužtų.',
      'Grąžintų prekių kainą grąžiname jas gavę, kai įmanoma — tuo pačiu mokėjimo būdu. Atsiėmimas nemokamas, todėl atsiėmimo užsakymams siuntimo negrąžiname.',
      'Jei kūrinys atkeliavo sudužęs, nufotografuokite pakuotę ir kūrinį ir parašykite per 48 valandas. Sutarsime dėl pakeitimo ar grąžinimo.',
      'Atsiėmimo metu grynieji nepriimami, todėl kasos aparatas šioms pardavimams nenaudojamas.',
    ],
    privacyTitle: 'Privatumas',
    privacyBody: [
      'Vardą, el. paštą, telefoną ir pristatymo adresą tvarkome tik užsakymams įvykdyti, sąskaitoms išrašyti ir Lietuvos buhalterinės apskaitos pareigoms.',
      'Teisiniai pagrindai: sutarties vykdymas ir teisinė prievolė (sąskaitos ir pajamų–išlaidų žurnalas). Duomenų neparduodame.',
      'Užsakymai ir sąskaitos saugomi Europos Sąjungoje (Google Cloud, regionas europe-central2) tiek, kiek reikalauja mokesčių teisė.',
      'Mokėjimą per Paysera tvarko Paysera pagal savo privatumo politiką. Gauname mokėjimo būseną, sumą ir nuorodas — ne Jūsų banko slaptažodį.',
      'Galite prašyti susipažinti, pataisyti ar ištrinti duomenis, kurių neprivalome saugoti, rašydami info@dkeramik.lt. Taip pat galite kreiptis į VDAI.',
      'Ši statinė svetainė gali saugoti kalbos pasirinkimą ir krepšelį Jūsų naršyklėje (localStorage).',
    ],
  },

  footer: {
    tagline: 'Įkvėpta Baltiškos gamtos. 🌿\nIš mano rankų - į Tavas.\n~',
    exploreHeading: 'Naršyti',
    contactHeading: 'Susisiek',
    contactPrompt: 'Turi klausimų ar nori individualaus kūrinio?',
    contactEmail: 'info@dkeramik.lt',
    copyright: 'DKeramik. Visos teisės saugomos.',
    links: {
      portfolio: 'Portfolio',
      shop: 'Parduotuvė',
      about: 'Apie mane',
      journal: 'Minčių Koštuvas',
      terms: 'Sąlygos',
      returns: 'Grąžinimai',
      privacy: 'Privatumas',
    },
  },

  common: {
    handcraftedWith: 'Rankų darbo keramika jaukiems namams.',
    languageSwitchLabel: 'EN',
  },
};
