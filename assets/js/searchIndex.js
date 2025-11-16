/**
 * Search index for the website.
 * Contains objects with page information for local search.
 * @constant {Array<{id: string, page: string, url: string, title: string, content: string, keywords: string[]}>}
 */
const searchIndex = [
  {
    id: 'home',
    page: 'Inicio',
    url: 'index.html',
    title: 'Inicio',
    content: 'Hola! Mi nombre es David Vargas. Trabajo como Ingeniero de Software con experiencia desarrollando soluciones eficientes y manteniendo sistemas críticos en producción. Me enfoco en resolver problemas reales, colaborar con equipos multidisciplinarios y aprender continuamente para fortalecer mis habilidades.',
    keywords: ['david vargas', 'ingeniero software', 'desarrollo', 'soluciones', 'equipos', 'aprender']
  },
  {
    id: 'home-experience',
    page: 'Inicio',
    url: 'index.html',
    title: 'Experiencia Profesional',
    content: 'Durante el último año me he especializado en desarrollo móvil y soluciones en la nube, creando apps optimizadas, funcionales y preparadas para producción. He trabajado con entornos móviles, servicios cloud y arquitecturas modernas.',
    keywords: ['movil', 'desarrollo movil', 'nube', 'cloud', 'apps', 'produccion', 'arquitecturas']
  },
  {
    id: 'projects-daily-journal',
    page: 'Proyectos',
    url: 'proyectos.html',
    title: 'Daily Journal - App de Diario Personal',
    content: 'Mobile App Development & Privacy. Tecnologías: Javascript, Capacitor, SQLite, Android, Material Design. Aplicación de diario personal completamente local con privacidad total de datos. Funcionalidad offline completa, exportación de entradas, análisis emocional de texto y galería de fotos integrada.',
    keywords: ['daily journal', 'diario', 'android', 'capacitor', 'sqlite', 'material design', 'privacidad', 'offline', 'emocional', 'galeria']
  },
  {
    id: 'projects-chromagrid',
    page: 'Proyectos',
    url: 'proyectos.html',
    title: 'ChromaGrid - Extracción de Paletas de Color',
    content: 'Web Development & Image Processing. Tecnologías: TypeScript, Vite, HTML5 Canvas, CSS. Herramienta web para extracción automática de paletas de colores desde imágenes usando procesamiento en el navegador con Canvas API.',
    keywords: ['chromagrid', 'paletas', 'colores', 'typescript', 'vite', 'canvas', 'imagenes', 'procesamiento']
  },
  {
    id: 'projects-migration',
    page: 'Proyectos',
    url: 'proyectos.html',
    title: 'Migración Mobile App - Cordova a Capacitor',
    content: 'Mobile Engineering & Performance. Tecnologías: Capacitor, TypeScript, Java SDKs, Android/iOS. Migración completa de aplicación móvil de Cordova a Capacitor, mejorando compatibilidad y rendimiento con integración de plugins nativos.',
    keywords: ['migracion', 'cordova', 'capacitor', 'typescript', 'java', 'android', 'ios', 'plugins', 'nativos']
  },
  {
    id: 'projects-computer-vision',
    page: 'Proyectos',
    url: 'proyectos.html',
    title: 'Computer Vision App - Detección de Objetos',
    content: 'Innovation & Frontend ML. Tecnologías: Transformers.js, IA, Navegador. Aplicación de visión computacional que detecta objetos en imágenes usando IA completamente en el navegador con tecnologías de última generación.',
    keywords: ['computer vision', 'vision', 'objetos', 'transformers.js', 'ia', 'navegador', 'deteccion']
  },
  {
    id: 'projects-shama-landing',
    page: 'Proyectos',
    url: 'proyectos.html',
    title: 'Landing Page Ferretería Shama',
    content: 'Web Development & Design. Tecnologías: HTML, SCSS, jQuery, Netlify. Página web responsive para ferretería con diseño moderno usando SCSS y despliegue en Netlify.',
    keywords: ['shama', 'ferreteria', 'landing page', 'html', 'scss', 'jquery', 'netlify', 'responsive']
  },
  {
    id: 'projects-shama-crm',
    page: 'Proyectos',
    url: 'proyectos.html',
    title: 'Mini CRM Ferretería Shama',
    content: 'Full-Stack Development & Business Solutions. Tecnologías: Hono.js, PostgreSQL, Vue, TypeScript. Sistema CRM completo para gestión empresarial con backend en Hono.js, base de datos PostgreSQL, frontend Vue con TypeScript y reportes asistidos por IA.',
    keywords: ['crm', 'shama', 'hono.js', 'postgresql', 'vue', 'typescript', 'reportes', 'ia', 'backend', 'frontend']
  },
  {
    id: 'projects-auth-go',
    page: 'Proyectos',
    url: 'proyectos.html',
    title: 'Auth-Go API - Sistema de Autenticación',
    content: 'Authentication • Sessions • Security Engineering. Tecnologías: Go, Fiber, MySQL, Docker. API robusta de autenticación con manejo de sesiones multi-dispositivo, refresh tokens seguros con revocación individual y arquitectura escalable.',
    keywords: ['auth-go', 'autenticacion', 'go', 'fiber', 'mysql', 'docker', 'sesiones', 'tokens', 'seguridad']
  },
  {
    id: 'projects-erp-refactor',
    page: 'Proyectos',
    url: 'proyectos.html',
    title: 'Refactorización ERP/Pedidos',
    content: 'Full-Stack & SysAdmin. Tecnologías: PHP, jQuery, MySQL, Digital Ocean. Refactorización completa de módulos legacy a SPA, optimización de consultas SQL, refactor del sistema de pedidos y administración de servidores en cloud.',
    keywords: ['erp', 'pedidos', 'php', 'jquery', 'mysql', 'digital ocean', 'refactorizacion', 'spa', 'consultas', 'servidores']
  },
  {
    id: 'about-me',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Sobre mí - David Vargas',
    content: 'Mi enfoque: Hola, soy David, tengo experiencia construyendo soluciones eficientes, manteniendo sistemas críticos en producción. Me gusta crear herramientas y soluciones que hagan más sencillo mi día a día, siempre aprendiendo algo nuevo en el proceso.',
    keywords: ['sobre mi', 'david', 'enfoque', 'soluciones', 'produccion', 'herramientas', 'aprender']
  },
  {
    id: 'about-skills-mobile',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Skills - Desarrollo Móvil',
    content: 'Mobile: Kotlin, Capacitor, Ionic, Android Studio, Xcode. Experiencia completa en desarrollo móvil nativo e híbrido con las mejores herramientas del mercado.',
    keywords: ['mobile', 'kotlin', 'capacitor', 'ionic', 'android studio', 'xcode', 'nativo', 'hibrido']
  },
  {
    id: 'about-skills-backend',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Skills - Desarrollo Backend',
    content: 'Backend: Node.js, PHP, Go, PostgreSQL, MongoDB, GraphQL. Desarrollo de APIs robustas y sistemas backend escalables con múltiples tecnologías.',
    keywords: ['backend', 'node.js', 'php', 'go', 'postgresql', 'mongodb', 'graphql', 'apis']
  },
  {
    id: 'about-skills-cloud',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Skills - Cloud & DevOps',
    content: 'Cloud & DevOps: Docker, AWS EC2 & S3, DigitalOcean, Cloudflare, Azure Artifacts. Administración de infraestructura cloud y prácticas DevOps.',
    keywords: ['cloud', 'devops', 'docker', 'aws', 'digitalocean', 'cloudflare', 'azure', 'infraestructura']
  },
  {
    id: 'about-skills-methodologies',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Skills - Metodologías y Herramientas',
    content: 'Metodologías & Tools: SCRUM, XP, Jira, Azure DevOps, Gitlab, OpsGenie. Experiencia en metodologías ágiles y herramientas de gestión de proyectos.',
    keywords: ['scrum', 'xp', 'jira', 'azure devops', 'gitlab', 'opsgenie', 'agiles', 'metodologias']
  },
  {
    id: 'about-experience-zigi',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Experiencia - Assistant Software Engineer en Zigi App',
    content: 'Assistant Software Engineer - Zigi App (Sep. 2024 - Presente). Apoyo a Gerencia de Tecnología en gestión administrativa, manejo de información clave y coordinación con equipos de desarrollo.',
    keywords: ['zigi app', 'assistant', 'gerencia tecnologia', 'administrativa', 'coordinacion']
  },
  {
    id: 'about-experience-allied',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Experiencia - Mobile Software Engineer en Allied Global',
    content: 'Mobile Software Engineer - Allied Global IT Services (Oct. 2024 - Sep. 2025). Desarrollo móvil en sector bancario, frontend y integración de APIs y sistemas de autenticación.',
    keywords: ['allied global', 'mobile', 'bancario', 'frontend', 'apis', 'autenticacion']
  },
  {
    id: 'about-experience-red-chapina',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Experiencia - Support Engineer en Red Chapina',
    content: 'Support Engineer - Red Chapina / Tranzmit (Mar. 2024 - Oct. 2024). Operaciones de soporte L2, deploys, gestión de acceso a producción y diagnóstico en servidores Linux AWS y bases de datos.',
    keywords: ['red chapina', 'tranzmit', 'support', 'soporte', 'deploys', 'linux', 'aws', 'bases datos']
  },
  {
    id: 'about-experience-tubagua',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Experiencia - Full Stack en Tubagua S.A.',
    content: 'Programador full stack - Tubagua, S.A (Sep. 2023 - Mar. 2024). Administración de servidores y bases de datos, mejora continua y refactorización de sistemas ERP con PHP y jQuery, automatización de procesos.',
    keywords: ['tubagua', 'full stack', 'servidores', 'bases datos', 'erp', 'php', 'jquery', 'automatizacion']
  },
  {
    id: 'about-experience-pagina-web',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Experiencia - Desarrollador Web',
    content: 'Desarrollador web - Página Web Guatemala (May. 2023 - Ago. 2023). Maquetación web desde cero con HTML, CSS, jQuery, Bootstrap 5, desarrollo con PHP y MySQL, soluciones WordPress.',
    keywords: ['pagina web guatemala', 'desarrollador web', 'html', 'css', 'jquery', 'bootstrap', 'php', 'mysql', 'wordpress']
  },
  {
    id: 'about-experience-dismafer',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Experiencia - Analista de Sistemas en DISMAFER',
    content: 'Analista de sistemas de TI - DISMAFER (Sep. 2020 - Abr. 2023). Soporte técnico remoto, soporte IT a departamentos, inspección de infraestructura de red y mantenimiento de sistemas ERP y páginas web.',
    keywords: ['dismafer', 'analista sistemas', 'soporte tecnico', 'infraestructura', 'red', 'erp', 'paginas web']
  },
  {
    id: 'about-education-software',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Educación - Técnico en Desarrollo de Software',
    content: 'Técnico en Desarrollo de Software - Universidad Galileo (2023 - 2025). Formación técnica especializada en desarrollo de software.',
    keywords: ['universidad galileo', 'tecnico', 'desarrollo software', 'formacion']
  },
  {
    id: 'about-education-graphics',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Educación - Diseño Gráfico Digital',
    content: 'Diplomado en Herramientas Digitales de Diseño Gráfico - Universidad de Occidente (2022). Especialización en herramientas digitales de diseño gráfico.',
    keywords: ['universidad occidente', 'diplomado', 'diseno grafico', 'herramientas digitales']
  },
  {
    id: 'about-education-cisco',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Certificación - CISCO IT Essentials',
    content: 'Certificación CISCO – IT Essentials - INTECAP (2021). Certificación fundamental en conceptos de TI y soporte técnico.',
    keywords: ['cisco', 'it essentials', 'intecap', 'certificacion', 'ti', 'soporte tecnico']
  },
  {
    id: 'about-contact',
    page: 'Sobre mí',
    url: 'sobre-mi.html',
    title: 'Información de Contacto',
    content: 'Email: josuedavidvl18@gmail.com, Ubicación: CA-9, Guatemala. Redes sociales: LinkedIn y GitHub disponibles.',
    keywords: ['contacto', 'email', 'guatemala', 'linkedin', 'github', 'redes sociales']
  }
];