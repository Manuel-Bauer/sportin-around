import { FC } from 'react';

import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  PopoverFooter,
  ButtonGroup,
} from '@chakra-ui/react';

interface Props {
  triggerText: string;
  popoverStyles: any;
  popoverContentStyles: any;
  popoverHeaderStyles: any;
  popoverHeaderText: string;
  popoverBodyText: string;
  popoverFooterStyles: any;
  buttonGroupStyles: any;
  buttonStyles: any;
  buttonText: string;
  triggerStyles: any;
}

const WalkthroughPopover: FC<Props> = ({
  triggerText,
  triggerStyles,
  buttonText,
  popoverStyles,
  popoverContentStyles,
  popoverHeaderStyles,
  popoverHeaderText,
  popoverBodyText,
  popoverFooterStyles,
  buttonGroupStyles,
  buttonStyles,
}) => {
  return (
    <Popover {...popoverStyles}>
      <PopoverTrigger>
        <Button {...triggerStyles}>{triggerText}</Button>
      </PopoverTrigger>
      <PopoverContent {...popoverContentStyles}>
        <PopoverHeader {...popoverHeaderStyles}>
          {popoverHeaderText}
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>{popoverBodyText}</PopoverBody>
        <PopoverFooter {...popoverFooterStyles}>
          <ButtonGroup {...buttonGroupStyles}>
            <Button {...buttonStyles}>{buttonText}</Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default WalkthroughPopover;
