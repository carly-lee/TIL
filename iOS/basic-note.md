# AppDelegate

- When the app runs, 'AppDelegate' file runs UIApplicationMain() which actually starts the app.
- Once it starts, the app looks for the file called 'info.plist' where the name of Storyboard file is set.
- Storyboard loads the View Controller that's set as the initial View Controller.
- View Controller loads its view.
- runs the 'viewDidLoad' function.

## Cocoa

Cocoa is Apple's native object-oriented application programming interface (API) for their operating system macOS.

## Darwin

C-based UNIX functions (such as arc4random_uniform) and C Standard Library functions (such as the common C math functions) that are built into OS X and iOS. These and many other features of UNIX and C are available via the Darwin module, which provides access to the C libraries in Darwin—Apple’s open-source UNIX-based core on which the OS X and iOS operating systems are built.

## Objective-C

```objective-c
#import "AppDelegate.h"

@interface AppDelegate ()

@end

@implementation AppDelegate

-(BOOL) application:(UIApplication *)application
  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
// method name                   param type     param names
{
// Get the screen and information about screen size
CGRect viewRect = [[UIScreen mainScreen] bounds];

// Initialize UIWindow window with screen size
self.window = [[UIWindow alloc] initWithFrame:viewRect];

// could be wrriten in one line
self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];

UIViewController *rootViewController = [[UIViewController alloc] init];

// Views in an iOS app are managed by a View Controller and displayed as subviews of a Window.
// In 'React Native', this view is the React Native part.
UIView *rootView = [[UIView alloc] initWithFrame:viewRect];
rootViewController.view = rootView;

// Make the window can use the viewController to draw the view
self.window.rootViewController = rootViewController;

// Receive all keyboard & non-touch events
[self.window makeKeyAndVisible];

return YES;
}
```

## Swift

```swift
import UIKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {
        // Override point for customization after application launch.
        return true
    }

    func applicationWillResignActive(_ application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and invalidate graphics rendering callbacks. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(_ application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(_ application: UIApplication) {
        // Called as part of the transition from the background to the active state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(_ application: UIApplication) {
        // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    }

    func applicationWillTerminate(_ application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }
}
```

# ViewController

- Has a main view and all other views go under the mainview as subview.
- 'ViewController' can tell view what to display.
- 'View' can tell controller when user is interacting.

## Objective-C

```objective-c
#import "ViewController.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end

```

```swift
import UIKit
// A framework that contains templates for standardized ways to display data in an app.
// Such as Text, Images, Button ... so on.

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
}
```

# Storyboard

- Visually layouts screens as scenes
- Contains ViewController and MainView. All other views go into MainView.

# ScrollView

- needs to know the exact size to scroll
- Any time when the size of subview is changing and needed to be controlled, it should be done inside 'viewWillLayoutSubviews()'

```swift
override func viewWillLayoutSubviews() {
    super.viewWillLayoutSubviews()

    // Need to tell ScrollView about the exact size to scroll
    scrollView.contentSize = CGSize( width: 375, height: 800 )
}
```

# ETC

- Bundle Identifier : Identifies an app as unique in the store.
