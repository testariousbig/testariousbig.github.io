export const translations = {
    es: {
        home: 'Inicio',
        cv: 'CV',
        projects: 'Proyectos',
        writeups: 'Writeups',
        loading: 'Cargando datos...',
        back: 'Volver',
        switchLang: 'EN',
        aboutMe: 'Sobre mí',
        subTitle: 'Desarrollador Full Stack | Estudiante de Ciberseguridad',
        homeSummaryTitle: 'Transformando código en seguridad.',
        homeSummaryText1: 'Soy un desarrollador Full Stack con más de 3 años de experiencia en el ecosistema <strong>PHP / Symfony</strong> y <strong>JavaScript</strong>. He gestionado proyectos como desarrollador único, abarcando desde la arquitectura hasta el despliegue y evolución de plataformas SaaS.',
        homeSummaryText2: 'Actualmente, estoy reorientando mi carrera hacia la <strong>Ciberseguridad</strong> y busco mi primera oportunidad en un entorno de seguridad informática, donde pueda aplicar mis conocimientos y contribuir a la protección de sistemas y redes.',
        currentStatus: 'Status Actual',
        statusSOC: 'SOC Level I Path',
        statusWebPen: 'Jr Penetration Tester Path',
        statusCTF: 'Resolviendo máquinas (CTFs)',
        statusAvailable: 'Disponible para trabajar',
        statusFinished: 'Completado',
        statusOngoing: 'En curso',
        location: 'Granada, España',
        viewCV: 'Ver Curriculum',
    },
    en: {
        home: 'Home',
        cv: 'Resume',
        projects: 'Projects',
        writeups: 'Writeups',
        loading: 'Loading data...',
        back: 'Back',
        switchLang: 'ES',
        aboutMe: 'About Me',
        subTitle: 'Full Stack Developer | Cybersecurity student',
        homeSummaryTitle: 'Transforming code into security.',
        homeSummaryText1: 'I am a Full Stack developer with more than 3 years of experience in the <strong>PHP / Symfony</strong> and <strong>JavaScript</strong> ecosystem. I have managed projects as a lone developer, covering everything from architecture to the deployment and evolution of SaaS platforms.',
        homeSummaryText2: 'Currently, I am reorienting my career towards <strong>Cybersecurity</strong> and I am looking for my first opportunity in an IT security environment, where I can apply my knowledge and contribute to the protection of systems and networks.',
        currentStatus: 'Current Status',
        statusSOC: 'SOC Level I Path',
        statusWebPen: 'Jr Penetration Tester Path',
        statusCTF: 'Solving machines (CTFs)',
        statusAvailable: 'Available for work',
        statusFinished: 'Completed',
        statusOngoing: 'In progress',
        location: 'Granada, Spain',
        viewCV: 'View Resume',
    }
};

let currentLang = localStorage.getItem('lang') || 'es';

export function getLang() {
    return currentLang;
}

export function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    window.dispatchEvent(new Event('languageChanged'));
}

export function t(key) {
    return translations[currentLang][key];
}
