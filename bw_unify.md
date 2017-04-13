# Developer Unification

As we consider how to unify our API and customer portals, there are a few things to consider from a developer point of view.

## General Pain

*Numbers / Voice / Messaging* vs *Numbers*

Customers who come to Bandwidth from Twilio and the like are used to a one-stop shop for _mostly_ everything.

Generally speaking we attract customers by offering advanced number management along side our voice and messaging APIs.  With the number management customers can:

* Min/Max LCR
* Group Message
* Port in/out via API
* Dig deeper when searching for numbers

However, because the two systems are mildly disjointed, there is some pain associated with exploring the _reasons_ customers chose to migrate to Bandwidth.

### Iris without safety guards

Number management via Iris (dashboard) is daunting. There is a learning curve, so much so, that initial account setup (to do correctly) is handled by internal staff.

Hybrid customers typically haven't thought about all the underlying telco infrastructure: [sip peers](https://en.wikipedia.org/wiki/Peer-to-peer_SIP), sites, NPA, LNP, LOAs, or LATAs.

Ordering a phone number moves from 1-2 API requestes:

```http
GET https://api.company.com/phoneNumbers

[
    "+12223334444",
    "+12223334445",
    "...",
    "+12223334446"
]

POST https://api.company.com/phoneNumbers

{
    "phoneNumber": "+12223334444"
}
```

To 1-2 API requests that are wrapped in an `<Order>` and need a `<SiteId>` along with one of the following XML types:

* `ExistingTelephoneNumberOrderType`
* `AreaCodeSearchAndOrderType`
* `RateCenterSearchAndOrderType`
* `NPANXXSearchAndOrderType`
* `TollFreeVanitySearchAndOrderType`
* `TollFreeWildCharSearchAndOrderType`
* `StateSearchAndOrderType`
* `CitySearchAndOrderType`
* `ZIPSearchAndOrderType`
* `LATASearchAndOrderType`
* `CombinedSearchAndOrderType`

```http
POST https://api.bandwidth.com/accounts/a-123/orders

<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Order>
    <CustomerOrderId>123456789</CustomerOrderId>
    <Name>Area Code Order</Name>
    <BackOrderRequested>false</BackOrderRequested>
    <CombinedSearchAndOrderType>
        <NpaNxx>919439</NpaNxx>
        <City>RALEIGH</City>
        <State>NC</State>
        <EnableLCA>false</EnableLCA>
        <Quantity>1</Quantity>
    </CombinedSearchAndOrderType>
    <TnAttributes>
        <TnAttribute>Protected</TnAttribute>
    </TnAttributes>
    <PartialAllowed>true</PartialAllowed>
    <SiteId>743</SiteId>
</Order>
```

For customers that moved to Bandwidth for deeper number management: :thumbsup: :thumbsup:

For customers that moved to Bandwidth for LCR, Group Messaging, or Pricing. All of a sudden order numbers just got complicated.

### Current Hybrid Life

Once the developers get used to power of Iris, it's now time to order the numbers (twice).

Using the examples discussed before, devs search and order numbers either in bulk, one-at-a-time, or even backorder (with a callback).

To _actually_ use the numbers in a Hybrid/unified model, they need to import the numbers to Catapult *ONE AT A TIME*.

* _Bulk order in Iris with XML_
* _Import one-by-one to Catapult with JSON_ *neat*

#### Order 100 Numbers and import them

1. Order the numbers by creating a `CombinedSearchAndOrderType` and specifiying the magic keys to make them work.

```http
POST https://api.bandwidth.com/accounts/a-123/orders

<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Order>
    <CustomerOrderId>123456789</CustomerOrderId>
    <Name>Area Code Order</Name>
    <BackOrderRequested>false</BackOrderRequested>
    <CombinedSearchAndOrderType>
        <NpaNxx>919439</NpaNxx>
        <City>RALEIGH</City>
        <State>NC</State>
        <EnableLCA>false</EnableLCA>
        <Quantity>100</Quantity>
    </CombinedSearchAndOrderType>
    <TnAttributes>
        <TnAttribute>Protected</TnAttribute>
    </TnAttributes>
    <PartialAllowed>true</PartialAllowed>
    <SiteId>743</SiteId>
</Order>
```

2. Import each number one-by-one (100 requests). *BUT WAIT* Our API is rate limited, so be sure to contact our support staff to find out what your rate limit is. (Negoiated by contract!). Then add that logic to your code so you don't fail to import the number.

```http
POST https://api.catapult.inetwork.com/v1/users/{{UserId}}/phoneNumbers
{
  "number": "+19194390000",
  "applicationId":"{{applicationId}}",
  "name" : "text messaging TN",
  "provider": {
    "providerName": "bandwidth-dashboard",
    "properties": {
      "accountId": "9999999",
      "userName": "wileCoyote",
      "password": "catchThatBird"
    }
  }
}
```

3. In code

```python
number_api = bandwidth.client('numbers', 'account info')
account_api = bandwidth.client('account', 'account info')
message_api = banwidth.client('messaging', 'account info')

## What devs expect
my_numbers = account_api.search_and_order(npa_nxx='919439', quantity=100)

messages_ids = []
for number in my_numbers:
    message_ids.push(
        message_api.send_message(from_=number, to=other_number, text='Hi from Bandwidth'))

################## What the flow is now #############################

number_api = bandwidth.client('numbers', 'account info')
account_api = bandwidth.client('account', 'account info')
message_api = banwidth.client('messaging', 'account info')

my_numbers = number_api.combined_search_and_order(
                                                  npa_nxx = '919439',
                                                  quantity = 100,
                                                  site_id = 743,
                                                  partial_allowed = True,
                                                  custom_order_id = '123456789',
                                                  name = 'Area Code Order',
                                                  back_order_requested = False,
                                                  tn_attributes = 'Protected'
                                                  )
def import_number(storage, number):
    return storage.push(
        account_api.import_number(
                                  number=number,
                                  application_id='a-123',
                                  name='imported number',
                                  provider='bandwidth-dashboard',
                                  account_id = '999999',
                                  user_name = 'band',
                                  password = 'width'
                                  ))

my_numbers_2 = []
## Terrible wait code
for number in my_numbers
    try:
        import_number(my_numbers_2, number)
    except RateLimitError:
        # wait 10s to try again
        time.sleep(10)
        import_number(my_numbers_2, number)

# Only can send messages from numbers imported
for number in my_numbers_2:
    message_ids.push(
        message_api.send_message(from_=number, to=other_number, text='Hi from Bandwidth'))
```


## How does this cost customers money

As with anything, the more complex the system the _longer_ it takes to be done coding, the more money spent to get to workable prototype.

### There is no _real_ Iris test account

After the developer finally gets the word they're integrating with Bandwidth. The first thing is to sign up for an acount and start playing around. This is generally known as _time to first hello world_. Obviously there are more complex `hello worlds` but the idea is the same.

We can not (as of now) give the reigns over to a customer on Iris without coaching or a DTH (billing) ID. So before the developer gets to order a phone number and make their first call; someone, somewhere, has to get a contract signed and set them up correctly.

## How does this cost Bandwidth money

Besides the relatively obvious fact, the longer spent developing first prototype the longer we wait on revenue.

From an operations stand point.

We have duplicate functionality that needs to be maintained, documented, developed, and marketed.

