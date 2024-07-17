import Container from '@/components/container';

import ReactQueryBuilder from './react-query-builder';

export default function Home() {
    return (
        <main>
            <Container className="my-10">
                <ReactQueryBuilder />
            </Container>
        </main>
    );
}
