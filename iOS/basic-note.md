# AppDelegate.m

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

## Lifesycle methods

- application:didFinishLaunchingWithOptions:   
  : called the first when an application is launched.
  
- applicationWillResignActive:
- applicationDidEnterBackground:
- applicationWillEnterForeground:
- applicationDidBecomeActive:
- applicationWillTerminate:

# ViewController.m

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