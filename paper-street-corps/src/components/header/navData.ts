export const NAV_TABS = [
    { label: 'Home', path: '/', dropdown: null },
  
    {
      label: 'Typology Tests',
      path: '/tests',
      dropdown: [
        { label: 'MBTI Test', path: '/tests/mbti' },
        { label: 'Socionics Test', path: '/tests/socionics' }
      ]
    },
  
    {
      label: 'Typology Theories',
      path: '/theories',
      dropdown: [
        { label: 'MBTI', path: '/theories/mbti' },
        { label: 'Socionics', path: '/theories/socionics' }
      ]
    },
  
    {
      label: 'Software Tools',
      path: '/tools',
      dropdown: [
        { label: 'Typology Engine', path: '/tools/engine' },
        { label: 'Analysis Toolkit', path: '/tools/analysis' }
      ]
    },
  
    { label: 'About', path: '/about', dropdown: null },
    { label: 'Team', path: '/team', dropdown: null }
  ];
  