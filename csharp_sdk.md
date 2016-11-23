# Bandwidth's New C# SDK

Over the past months we have been working to refactor our SDKs.  We're ready to announce our pre-release C# / .NET SDK.  

Check out the SDK on [Github](https://github.com/Bandwidth/csharp-bandwidth)

The SDK is available via [NuGet](https://www.nuget.org/packages/Bandwidth.Net/3.0.0-beta4)

Full documentation is hosted at [dev.bandwidth.com](http://dev.bandwidth.com/csharp-bandwidth/html/R_Project_API.htm)

## Install via NuGet
To install Bandwidth.Net, run the following command in the [Package Manager Console](https://docs.nuget.org/ndocs/tools/package-manager-console):

`PM> Install-Package Bandwidth.Net -Pre`

## What's New?
A few of the improvements we've made over v2.x

* Reduced depenecies: can now run entirely on [.NET Core](https://www.microsoft.com/net/core#windowsvs2015)
* No more client singleton. Everything is inhereted from a base client.
* Each API method now expects a `POCO` _plain ole C# object_. Immensly helps MSFT intelli-sense and the like to display a list of named parameters for each API call.
* `IEnumerable` Lists for all `list` resources.
    - Fetch entire messages with a simple `for` loop.
    - List all calls for date range.
* `Async` function calls were introduced in .NET 4.5. The SDK now defaults to `await`/`async` function patterns were applicable.
    - Read some of the advantages of [`async`/`await`](https://msdn.microsoft.com/en-us/magazine/dn802603.aspx)

## Supported Versions
`Bandwidth.Net` should work on all levels of .Net Framework 4.5+.

| Version | Support Level |
|---------|---------------|
| <4.5 | Unsupported |
| 4.5 | Supported |
| 4.6 | Supported |
| .Net Core (netstandard1.6)  | Supported |
| PCL (Profile111) | Supported |
| Xamarin (IOS, Android, MonoTouch) | Supported |


## Examples
Enough of the talk, here are some examples demonstrating some simple tasks

### Order a phone number

```csharp
//Download the .net sdk from ap.bandwidth.com/docs/helper-libraries/net
using System;
using System.Threading.Tasks;
using Bandwidth.Net;
using Bandwidth.Net.Api;

public class Program
{
  //API credentials which can be found on your account page at https://catapult.inetwork.com/pages/login.jsf
  private const string UserId = "{{userId}}";  //{user_id}
  private const string Token = "{{token}}"; //{token}
  private const string Secret = "{{secret}}"; //{secret}

  public static void Main()
  {
    try
    {
      RunAsync().Wait();
    }
    catch (Exception ex)
    {
      Console.Error.WriteLine(ex.Message);
      Environment.ExitCode = 1;
    }
  }

  private static async Task RunAsync()
  {
    var client = new Client(UserId, Token, Secret);
    var numbers = await client.AvailableNumber.SearchAndOrderLocalAsync(new LocalNumberQueryForOrder
    {
      AreaCode = "910",
      Quantity = 1
    });
    var firstResult = numbers.First();
    var number = firstResult.Number;
    var numberId = firstResult.Id;
    Console.WriteLine($"Ordered {numbers.Length} numbers");
    Console.WriteLine($"Ordered {number} with id: {numberId}");
  }
}
```

### Send a single text message

```csharp
using System;
using System.Linq;
using System.Threading.Tasks;
using Bandwidth.Net;
using Bandwidth.Net.Api;


namespace ConsoleApplication
{
    public class Program
    {

        // Replace with your phone number
        private const string YOUR_PHONE_NUMBER = "YOUR_PHONE_NUMBER";
        // Replace with your bandwidth number
        private const string BANDWIDTH_PHONE_NUMBER = "BANDWIDTH_PHONE_NUMBER";
        private const string UserId = "{{userId}}";  //{user_id}
        private const string Token = "{{token}}"; //{token}
        private const string Secret = "{{secret}}"; //{secret}

        public static void Main(string[] args)
          {
            try
            {
                SendMessage().Wait();
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex.Message);
            }
        }

        private static async Task SendMessage()
        {
            var data = new Bandwidth.Net.Api.MessageData
                {
                    To = YOUR_PHONE_NUMBER,
                    From = BANDWIDTH_PHONE_NUMBER,
                    Text = "Hi from C#"
                };
            var client = new Client(UserId, Token, Secret);


            var message = await client.Message.SendAsync(data);
            Console.WriteLine(message.Id);
            
            var messages = client.Message.List();
            Console.WriteLine(messages.First().Text);
        }
    }
}
```

### Send a single picture message

```csharp
//Download the .net sdk from ap.bandwidth.com/docs/helper-libraries/net

using System;
using System.Threading.Tasks;
using Bandwidth.Net;
using Bandwidth.Net.Api;

public class Program
{
    // Replace with your phone number
    private const string YOUR_PHONE_NUMBER = "YOUR_PHONE_NUMBER";
    // Replace with your bandwidth number
    private const string BANDWIDTH_PHONE_NUMBER = "BANDWIDTH_PHONE_NUMBER";
    private const string UserId = "{{userId}}";  //{user_id}
    private const string Token = "{{token}}"; //{token}
    private const string Secret = "{{secret}}"; //{secret}

    public static void Main()
    {
        try
        {
            RunAsync().Wait();
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(ex.Message);
            Environment.ExitCode = 1;
        }
    }

    private static async Task RunAsync()
    {
        var client = new Client(UserId, Token, Secret);

        var mms = await client.Message.SendAsync(new MessageData
        {
            From = BANDWIDTH_PHONE_NUMBER, 
            To = YOUR_PHONE_NUMBER,
            Text = "Hi from C#, here is a picture :)",
            Media = new[] {"https://s3.amazonaws.com/bwdemos/logo.png"}
        });
    }
}
```

### Make a phone call

```csharp
//Download the .net sdk from ap.bandwidth.com/docs/helper-libraries/net

using System;
using System.Threading.Tasks;
using Bandwidth.Net;
using Bandwidth.Net.Api;

public class Program
{
    // Replace with your phone number
    private const string YOUR_PHONE_NUMBER = "YOUR_PHONE_NUMBER";
    // Replace with your bandwidth number
    private const string BANDWIDTH_PHONE_NUMBER = "BANDWIDTH_PHONE_NUMBER";
    private const string UserId = "{{userId}}";  //{user_id}
    private const string Token = "{{token}}"; //{token}
    private const string Secret = "{{secret}}"; //{secret}
    public static void Main()
    {
        try
        {
            RunAsync().Wait();
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(ex.Message);
            Environment.ExitCode = 1;
        }
    }

    private static async Task RunAsync()
    {
        var client = new Client(UserId, Token, Secret);

        var call = await client.Call.CreateAsync(new CreateCallData
        {
            From = BANDWIDTH_PHONE_NUMBER, 
            To = YOUR_PHONE_NUMBER,
            CallbackUrl = "http://requestb.in/10sze251"
        });
        Console.WriteLine($"Call Id is {call.Id}");
    }
}
```

## More coming soon

We have already released our [Node SDK](http://dev.bandwidth.com/clientLib/node.html).  Future releases for [Python](https://github.com/Bandwidth/python-bandwidth) and extended Node and C# functionality are up next.