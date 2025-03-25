import {
  Html,
  Button,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Img,
} from "@react-email/components";
import * as React from "react";

export default function RegisterUserEmail({ password }) {
  return (
    <Html>
      <Head />
      <Preview>
        🎉 Welcome to Our Store! Enjoy Shopping with Exclusive Offers 🎉
      </Preview>
      <Body className="bg-gray-100 p-4">
        <Container className="bg-white p-6 rounded-lg shadow-md text-center">
          <Section className="mb-4">
            <Img
              src="https://images.pexels.com/photos/6311687/pexels-photo-6311687.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              width="100%"
              height="auto"
              alt="Celebration"
              className="rounded-lg"
            />
          </Section>

          <Section className="mb-4">
            <Heading className="text-2xl font-bold text-gray-800">
              Welcome to Our Store!
            </Heading>
            <Text className="text-lg text-gray-600 leading-relaxed">
              {password && <p>{`Your password is: ${password}`}</p>}
              Hey there! We're thrilled to have you on board. 🎊 Start exploring
              our exclusive collection and enjoy a seamless shopping experience.
            </Text>
          </Section>

          <Section className="mb-6">
            <Button
              href="https://localhost:3000/api/auth/login"
              className="box-border max-w-fit bg-orange-500 text-white px-6 py-3 rounded-md text-lg font-semibold shadow-md hover:bg-orange-600 transition-all"
            >
              Start Shopping Now
            </Button>
          </Section>

          <Text className="text-sm text-gray-500 mt-4">
            Happy Shopping! 🛍️ <br /> The Carma Canada Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
