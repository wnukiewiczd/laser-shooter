#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Komunikacja bezprzewodowa
const char *ssid = "projekt_AP";         // Nazwa sieci WiFi Raspberry Pi
const char *password = "malinka3";       // Hasło do sieci WiFi
const char *mqtt_server = "192.168.4.2"; // Adres IP Raspberry Pi (broker MQTT)

WiFiClient espClient;
PubSubClient client(espClient);

// Deklaracja pinów dla paska LED
const int pinRed = D2;   // Pin sterujący kolorem czerwonym
const int pinGreen = D1; // Pin sterujący kolorem zielonym
const int pinBlue = D5;  // Pin sterujący kolorem niebieskim

// Kolory pasek LED
#define turnOff 0
#define red 1
#define green 2

// Deklaracja pinu dla fototranzystora
int photoTransistor = A0;

void setup()
{

  Serial.begin(115200);

  // Nawiązywanie połączenia po wifi
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(onMessage);
  reconnect();

  // Konfiguracja pinow dla paska LED
  pinMode(pinRed, OUTPUT);
  pinMode(pinGreen, OUTPUT);
  pinMode(pinBlue, OUTPUT);
  // Pasek LED w stanie początkowym ma być zgaszony
  analogWrite(pinRed, 0);
  analogWrite(pinGreen, 0);
  analogWrite(pinBlue, 0);
}

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }

  client.loop();

  int lightRead = analogRead(photoTransistor);
  Serial.print(lightRead);
  if (lightRead < 300)
  {
    Serial.print("Cel 1 trafiony");
    client.publish("wemos1/lightRead", "hit"); // Wysłanie wiadomości do raspberry o trafieniu w cel
    setColor(turnOff);                         // Zgaszenie paska LED
  }

  Serial.println("");
  delay(100); // !!! Co ile czyta wartości z fototranzytora
}

// Funkcja wyzwalana po otrzymaniu wiadomości od raspberry
void onMessage(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("]: ");

  String message;
  for (int i = 0; i < length; i++)
  {
    message += (char)payload[i];
  }

  Serial.println(message);

  if (message == "turnOnGreen")
  {
    setColor(green); // Zapal pasek led na zielono
  }
  else if (message == "turnOnRed")
  {
    setColor(red); // Zapal pasek led na czerwono
  }
  else if (message == "stop")
  {
    setColor(turnOff);
  }
}

// Obsługa komunikacji przez wifi
void setup_wifi()
{
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("WiFi connected");
}

void reconnect()
{
  while (!client.connected())
  {
    if (client.connect("WemosClient1"))
    {
      client.subscribe("raspberry/Wemos1/ledStrip"); // Subscribe to the topic for receiving data
      client.subscribe("raspberry/WemosAll/ledStrip");
    }
    else
    {
      delay(5000);
    }
  }
}

// Sterowanie paskiem LED
void setColor(int colorName)
{

  if (colorName == green)
  {
    analogWrite(pinRed, 255);
    analogWrite(pinGreen, 0);
    analogWrite(pinBlue, 0);
  }

  if (colorName == red)
  {
    analogWrite(pinRed, 0);
    analogWrite(pinGreen, 255);
    analogWrite(pinBlue, 0);
  }

  if (colorName == turnOff)
  {
    analogWrite(pinRed, 0);
    analogWrite(pinGreen, 0);
    analogWrite(pinBlue, 0);
  }
}

void rainbow()
{
  unsigned long startTime = millis(); // Pobierz aktualny czas
  while (millis() - startTime < 2000)
  { // Pętla przez 2 sekundy
    // Generowanie losowych wartości dla kolorów
    int redValue = random(0, 255);
    int greenValue = random(0, 255);
    int blueValue = random(0, 255);

    // Ustawianie wyjściowych wartości RGB
    analogWrite(pinRed, redValue);
    analogWrite(pinGreen, greenValue);
    analogWrite(pinBlue, blueValue);

    delay(100); // Krótkie opóźnienie między zmianami kolorów
  }
}
