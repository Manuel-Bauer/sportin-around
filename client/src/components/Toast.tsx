import { FC } from 'react';

import { useToast, Button } from '@chakra-ui/react';

interface Props {}

const WalkthroughPopover: FC<Props> = ({}) => {
  const toast = useToast();

  return (
    <Button
      onClick={() =>
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      }
    >
      Show Toast
    </Button>
  );
};

export default WalkthroughPopover;
