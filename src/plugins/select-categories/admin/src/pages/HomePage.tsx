import { Main, Button } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import { getTranslation } from '../utils/getTranslation';

const HomePage = () => {
  const { formatMessage } = useIntl();

  return (
    <Main>
      <div
        style={{
          padding: '20px',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            height: '100vh',
            backgroundColor: 'white',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <h1>SETUP MENU</h1>

          <div style={{ marginTop: 'auto' }}>
            <Button>Add Category</Button>
          </div>
        </div>
      </div>
    </Main>
  );
};

export { HomePage };
