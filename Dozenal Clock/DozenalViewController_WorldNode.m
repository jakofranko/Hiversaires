#import "DozenalViewController_WorldNode.h"

NSString *hello[200][4][20] = {0};
NSString *node[200][4][20] = {0};
NSDictionary *world;

@implementation DozenalViewController (Math)
-(NSMutableArray*) add {
    
	hello[100][2][4] = @"!hey there";
	
	NSMutableArray *node = [NSMutableArray arrayWithObjects:@"String1",@"String2",@"String3",nil];
	
//	node[0][1] = [NSMutableArray arrayWithObjects:
//				  @"nodeNext",
//				  @"actionId",
//				  @"actionName",
//				  @"actionValue",
//				  @"actionSolution",
//				  nil];
	
	// =====================
	// Forest ( 0 - 11 )
	// ====================
	
	
	node[0]		= [NSMutableArray arrayWithObjects:[NSMutableArray arrayWithObjects:@"0",@"1",@"2",@"3",nil],[NSMutableArray arrayWithObjects:@"0",@"1",@"2",@"3",nil],[NSMutableArray arrayWithObjects:@"0",@"1",@"2",@"3",nil],[NSMutableArray arrayWithObjects:@"0",@"1",@"2",@"3",nil],nil];
	node[0][0]	= [NSMutableArray arrayWithObjects:@"1",nil];
	
	node[1]		= [NSMutableArray arrayWithObjects:[NSMutableArray arrayWithObjects:@"0",@"1",@"2",@"3",nil],[NSMutableArray arrayWithObjects:@"0",@"1",@"2",@"3",nil],[NSMutableArray arrayWithObjects:@"0",@"1",@"2",@"3",nil],[NSMutableArray arrayWithObjects:@"0",@"1",@"2",@"3",nil],nil];
	node[1][0]	= [NSMutableArray arrayWithObjects:@"2",nil];
	node[1][2]	= [NSMutableArray arrayWithObjects:@"0",nil];
	
	
	
	
	return node;
}


@end