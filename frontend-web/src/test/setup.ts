import '@testing-library/jest-dom';

// 全局 Mock
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

// Mock window.Feishu
Object.defineProperty(window, 'Feishu', {
  value: {
    api: {
      getUserInfo: () => Promise.resolve({ user_id: 'mock_user', name: 'Mock User' }),
    },
  },
  writable: true,
});
