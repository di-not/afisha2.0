declare module '*.svg' {
    import React from 'react';
    const content: React.FC<React.SVGProps<SVGSVGElement>>;
    export default content;
  }
  
  // Альтернатива для именованных экспортов
  declare module '*.svg?react' {
    import React from 'react';
    const content: React.FC<React.SVGProps<SVGSVGElement>>;
    export default content;
  }