import { Metadata } from 'next';
import PageContent from '@/components/common/page-content';

export const metadata: Metadata = {
  title: 'О Нас',
  description: '',
};

const AboutPage = () => {
  return (
    <div>
      <PageContent/>
    </div>
  )
}

export default AboutPage;